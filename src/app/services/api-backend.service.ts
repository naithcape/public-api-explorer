import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../models/api.model';
import { ApiRequest } from '../models/api-request.model';

@Injectable({
  providedIn: 'root'
})
export class ApiBackendService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getAllApis(): Observable<Api[]> {
    return this.http.get<Api[]>(`${this.apiUrl}/apis`);
  }

  getActiveApis(): Observable<Api[]> {
    return this.http.get<Api[]>(`${this.apiUrl}/apis/active`);
  }

  getApisByStatus(status: string): Observable<Api[]> {
    return this.http.get<Api[]>(`${this.apiUrl}/apis/status/${status}`);
  }

  addApi(api: Partial<Api>): Observable<Api> {
    return this.http.post<Api>(`${this.apiUrl}/apis`, api);
  }

  updateApi(api: Api): Observable<Api> {
    return this.http.put<Api>(`${this.apiUrl}/apis/${api.id}`, api);
  }

  deleteApi(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/apis/${id}`);
  }

  voteUp(id: number): Observable<Api> {
    return this.http.post<Api>(`${this.apiUrl}/apis/${id}/vote-up`, {});
  }

  voteDown(id: number): Observable<Api> {
    return this.http.post<Api>(`${this.apiUrl}/apis/${id}/vote-down`, {});
  }

  // API Request methods
  getAllRequests(): Observable<ApiRequest[]> {
    return this.http.get<ApiRequest[]>(`${this.apiUrl}/requests`);
  }

  getPendingRequests(): Observable<ApiRequest[]> {
    return this.http.get<ApiRequest[]>(`${this.apiUrl}/requests/pending`);
  }

  submitRequest(request: Partial<ApiRequest>): Observable<ApiRequest> {
    return this.http.post<ApiRequest>(`${this.apiUrl}/requests`, request);
  }

  approveApiRequest(id: number, reason?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/requests/${id}/approve`, { reason });
  }

  declineApiRequest(id: number, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/requests/${id}/decline`, { reason });
  }
}
