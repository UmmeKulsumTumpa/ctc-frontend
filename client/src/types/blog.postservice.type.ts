export interface BlogPostService {
    post_service_id: string;
    post_id: string;
    service_id: string;
    cost?: number;
    rating?: number;
    visit_date?: string;
    notes?: string;
    recommended?: boolean;
    created_at: string;
}

export interface BlogPostServiceCreate {
    post_id: string;
    service_id: string;
    cost?: number;
    rating?: number;
    visit_date?: string;
    notes?: string;
    recommended?: boolean;
}
