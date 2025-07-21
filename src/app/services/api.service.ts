import { Injectable, signal } from '@angular/core';
import { Api, ApiStatus } from '../models/api.model';
import { ApiRequest } from '../models/api-request.model';
import { ApiBackendService } from './api-backend.service';
import { Observable, tap, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _apis = signal<Api[]>([]);
  private _apiRequests = signal<ApiRequest[]>([]);
  public apis = this._apis.asReadonly();
  public apiRequests = this._apiRequests.asReadonly();

  constructor(private apiBackend: ApiBackendService) {
    this.initialize();
  }

  private initialize(): void {
    this.refreshApis();
    this.refreshApiRequests();
  }

  private refreshApis(): void {
    this.apiBackend.getAllApis().subscribe({
      next: (apis) => {
        this._apis.set(apis);
      },
      error: (error) => {
        console.error('Error fetching APIs:', error);
        this._apis.set([]);
      }
    });
  }

  private refreshApiRequests(): void {
    this.apiBackend.getAllRequests().subscribe({
      next: (requests) => {
        this._apiRequests.set(requests);
      },
      error: (error) => {
        console.error('Error fetching API requests:', error);
        this._apiRequests.set([]);
      }
    });
  }

  getAllApis(): Api[] {
    return this._apis();
  }

  getAllApisObservable(): Observable<Api[]> {
    return this.apiBackend.getAllApis().pipe(
      tap(apis => this._apis.set(apis))
    );
  }

  getActiveApis(): Api[] {
    return this._apis().filter(api => api.active);
  }

  getActiveApisObservable(): Observable<Api[]> {
    return this.apiBackend.getActiveApis().pipe(
      tap(apis => this._apis.set(apis))
    );
  }

  getInactiveApis(): Api[] {
    return this._apis().filter(api => !api.active);
  }

  getApisByStatus(status: ApiStatus): Api[] {
    return this._apis().filter(api => api.status === status);
  }

  getApisByStatusObservable(status: ApiStatus): Observable<Api[]> {
    return this.apiBackend.getApisByStatus(status).pipe(
      tap(apis => this._apis.update(currentApis => {
        // Update only the APIs with the requested status
        const filteredApis = currentApis.filter(api => api.status !== status);
        return [...filteredApis, ...apis];
      }))
    );
  }

  searchApis(term: string): Api[] {
    const lowerTerm = term.toLowerCase();
    return this._apis().filter(api =>
      api.name.toLowerCase().includes(lowerTerm) ||
      api.description.toLowerCase().includes(lowerTerm)
    );
  }

  addApi(api: Omit<Api, 'id' | 'votes_up' | 'votes_down' | 'status' | 'active'>): Observable<Api> {
    return this.apiBackend.addApi(api).pipe(
      tap(newApi => {
        this._apis.update(apis => [...apis, newApi]);
      })
    );
  }

  updateApi(api: Api): Observable<Api> {
    return this.apiBackend.updateApi(api).pipe(
      tap(updatedApi => {
        this._apis.update(apis =>
          apis.map(a => a.id === updatedApi.id ? updatedApi : a)
        );
      })
    );
  }

  deleteApi(id: number): Observable<any> {
    return this.apiBackend.deleteApi(id).pipe(
      tap(() => {
        this._apis.update(apis =>
          apis.filter(api => api.id !== id)
        );
      })
    );
  }

  voteUp(id: number): Observable<Api> {
    return this.apiBackend.voteUp(id).pipe(
      tap(updatedApi => {
        this._apis.update(apis =>
          apis.map(a => a.id === updatedApi.id ? updatedApi : a)
        );
      })
    );
  }

  voteDown(id: number): Observable<Api> {
    return this.apiBackend.voteDown(id).pipe(
      tap(updatedApi => {
        this._apis.update(apis =>
          apis.map(a => a.id === updatedApi.id ? updatedApi : a)
        );
      })
    );
  }

  getAllRequests(): Observable<ApiRequest[]> {
    return this.apiBackend.getAllRequests().pipe(
      tap(requests => this._apiRequests.set(requests))
    );
  }

  getPendingRequests(): Observable<ApiRequest[]> {
    return this.apiBackend.getPendingRequests().pipe(
      tap(requests => this._apiRequests.set(requests))
    );
  }

  submitRequest(request: Omit<ApiRequest, 'id' | 'submittedDate' | 'status' | 'statusReason'>): Observable<ApiRequest> {
    return this.apiBackend.submitRequest(request).pipe(
      tap(newRequest => {
        this._apiRequests.update(requests => [...requests, newRequest]);
      })
    );
  }

  approveApiRequest(id: number, reason?: string): Observable<any> {
    return this.apiBackend.approveApiRequest(id, reason).pipe(
      tap(() => {
        // Refresh both APIs and requests after approval
        this.refreshApis();
        this.refreshApiRequests();
      })
    );
  }

  declineApiRequest(id: number, reason: string): Observable<any> {
    return this.apiBackend.declineApiRequest(id, reason).pipe(
      tap(() => {
        this.refreshApiRequests();
      })
    );
  }
}
