export interface ActivityItem {
  id: number | string;
  project_id: number | string;
  boq_item_id?: number | string;
  work_order_id?: number | string | null;
  work_order_no?: string;
  activity_name?: string;
  name?: string;
  code?: string;
  discipline?: string;
  description?: string;
  planned_quantity?: number | string;
  total_quantity?: number | string;
  total_completed?: number | string;
  completed_quantity?: number | string;
  remaining_quantity?: number | string;
  completion_percentage?: number | string;
  unit?: string;
  engineer_id?: number | string | null;
  start_date?: string;
  end_date?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAY' | string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateActivityRequest {
  project_id: number | string;
  boq_item_id: number | string;
  work_order_id: number | string;
  engineer_id: number | string;
  start_date: string;
  end_date: string;
}

export interface UpdateActivityRequest {
  boq_item_id: number | string;
  work_order_id: number | string;
  engineer_id: number | string;
  start_date: string;
  end_date: string;
}

export interface DailyProgressItem {
  id: number | string;
  project_id: number | string;
  activity_id: number | string;
  activity_name?: string;
  entry_date: string;
  quantity_done: number;
  unit?: string;
  remarks?: string;
  created_by_name?: string;
  status?: string;
  created_at?: string;
}

export interface CreateDailyProgressRequest {
  project_id: number | string;
  activity_id: number | string;
  entry_date: string;
  quantity_done: number;
  remarks?: string;
}

export interface WorkOrderItem {
  id: number | string;
  project_id: number | string;
  work_order_no: string;
  project_name?: string;
  description: string;
  total_quantity: number;
  completed_quantity: number;
  unit?: string;
  rate: number;
  total_amount: number;
  status: 'DRAFT' | 'ACTIVE' | 'Completed' | 'COMPLETED' | 'CANCELLED' | string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export interface CreateWorkOrderRequest {
  project_id: number | string;
  work_order_no: string;
  description: string;
  total_quantity: number;
  unit?: string;
  rate: number;
  start_date?: string;
  end_date?: string;
}

export interface ProjectProgressSummary {
  total_activities: number;
  completed_activities: number;
  in_progress_activities: number;
  delayed_activities: number;
  overall_progress_percentage: number;
}
