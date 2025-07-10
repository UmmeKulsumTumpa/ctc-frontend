export type TravelPlanStatus = 'Draft' | 'Active' | 'Completed' | 'Cancelled';
export type VisitPriority = 'MustVisit' | 'Optional';
export type ParticipantRole = 'Owner' | 'Editor' | 'Viewer';

export interface TravelPlan {
  plan_id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  total_cost?: number;
  total_duration?: number;
  status?: TravelPlanStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTravelPlanRequestDto {
  name: string;
  start_date?: string;
  end_date?: string;
  total_cost?: number;
  total_duration?: number;
  status?: TravelPlanStatus;
}

export interface UpdateTravelPlanRequestDto {
  name?: string;
  start_date?: string;
  end_date?: string;
  total_cost?: number;
  total_duration?: number;
  status?: TravelPlanStatus;
}

export interface PlannedPlace {
  plan_id: string;
  place_id: string;
  priority?: VisitPriority;
}

export interface PlanParticipant {
  plan_id: string;
  user_id: number;
  is_going?: boolean;
  role_permission?: ParticipantRole;
}

export interface PlanComment {
  comment_id: string;
  plan_id: string;
  user_id: number;
  content: string;
  posted_at: string;
}

export interface TravelPlanServiceDetailDTO {
  plan_id: string;
  service_id: string;
  estimated_cost?: number;
  planned_visit_date?: string;
  notes?: string;
  notify_when_near?: boolean;
  created_at?: string;
}

export interface TravelPlanTransportDetailDTO {
  plan_id: string;
  service_id: string;
  estimated_cost?: number;
  planned_departure_time?: string;
  planned_arrival_time?: string;
  start_point_latitude?: number;
  start_point_longitude?: number;
  start_point_address?: string;
  end_point_latitude?: number;
  end_point_longitude?: number;
  end_point_address?: string;
  notes?: string;
  notify_when_near?: boolean;
  created_at?: string;
}

export interface TravelPlanServiceUnifiedDTO extends TravelPlanServiceDetailDTO {
  transport_details?: TravelPlanTransportDetailDTO | null;
}
