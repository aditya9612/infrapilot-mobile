export interface IssueItem {
  id: number | string;
  title: string;
  description?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  category: 'Material' | 'Equipment' | 'Labour' | 'Weather' | 'Design' | 'Safety' | 'Other' | string;
  project_id: number | string;
  project_name?: string;
  reported_date?: string;
  assigned_to?: string;
  assigned_to_id?: number | string;
  created_at?: string;
  updated_at?: string;
  resolution?: string;
}

export interface CreateIssueRequest {
  project_id: number | string;
  title: string;
  category: string;
  priority: string;
  reported_date: string;
  assigned_to?: string;
  description?: string;
}

export interface UpdateIssueRequest {
  title?: string;
  category?: string;
  priority?: string;
  status?: string;
  assigned_to?: string;
  description?: string;
  resolution?: string;
}

export interface IssueListResponse {
  success?: boolean;
  message?: string;
  data?: IssueItem[];
  items?: IssueItem[];
}
