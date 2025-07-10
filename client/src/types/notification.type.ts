export interface Notification {
    notification_id: string;
    user_id: number;
    message: string;
    type: 'PARTICIPANT_ADDED' | 'COMMENT_ADDED' | 'PLAN_CREATED' | 'GENERAL';
    data?: {
        plan_id?: string;
        plan_name?: string;
        added_by?: number;
        commenter_id?: number;
        comment_preview?: string;
        link?: string;
    };
    read: boolean;
    created_at: string;
}

export interface NotificationCreateDto {
    user_id: number;
    message: string;
    type: 'PARTICIPANT_ADDED' | 'COMMENT_ADDED' | 'PLAN_CREATED' | 'GENERAL';
    data?: {
        plan_id?: string;
        plan_name?: string;
        added_by?: number;
        commenter_id?: number;
        comment_preview?: string;
        link?: string;
    };
}
