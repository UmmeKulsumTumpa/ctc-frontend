export interface User {
    user_id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    age?: number;
    role: string;
    profile_picture?: string;
    bio?: string;
    last_login?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
