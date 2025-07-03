export interface UpdateUserRequest {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    age?: number;
    role?: string;
    profile_picture?: string;
    bio?: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
