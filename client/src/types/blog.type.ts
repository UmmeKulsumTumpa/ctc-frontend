import type { EffortLevel, Visibility } from "../constants/blog.constants";

export interface BlogPost {
    post_id: string;
    user_id: string;
    title: string;
    description?: string;
    total_cost?: number;
    total_duration?: number;
    effort_level?: EffortLevel;
    place_id?: string;
    categories?: string[];
    visibility: Visibility;
    likes: number;
    created_at: string;
}
