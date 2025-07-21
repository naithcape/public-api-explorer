export type ApiRequestStatus = 'Pending' | 'Approved' | 'Declined';
export interface ApiRequest {
  id: number;
  name: string;
  link: string;
  description: string;
  submittedDate: Date;
  status: ApiRequestStatus;
  statusReason?: string;
}
