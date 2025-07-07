import api from '../utils/api';
import type { ApiResponse } from '../types/api.response.type';
import type { User } from '../types/user.type';
import type { UpdateUserRequest, ChangePasswordRequest } from '../types/user.request.type';

export const getUser = async (userId: number): Promise<User> => {
    try {
        // Use the getUsers endpoint with id filter since GET /users/:id is not available
        const res = await api.get<ApiResponse<User[]>>('/users', { params: { user_id: userId } });
        if (!res.data.data || res.data.data.length === 0) throw new Error('User not found');
        return res.data.data[0];
    } catch (error: any) {
        console.error('Failed to get user:', error);
        throw new Error(error?.response?.data?.message || 'Failed to fetch user data');
    }
};

export const updateUser = async (userId: number, data: UpdateUserRequest): Promise<boolean> => {
    try {
        const filtered: Partial<UpdateUserRequest> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (
                value !== undefined &&
                value !== null &&
                !(typeof value === 'string' && value.trim() === '')
            ) {
                filtered[key as keyof UpdateUserRequest] = value;
            }
        });
        const res = await api.patch<ApiResponse<{ success: boolean }>>(`/users/${userId}`, filtered);
        return res.data.data.success;
    } catch (error: any) {
        console.error('Failed to update user:', error);
        throw new Error(error?.response?.data?.message || 'Failed to update user');
    }
};

export const changePassword = async (userId: number, data: ChangePasswordRequest): Promise<boolean> => {
    try {
        const res = await api.patch<ApiResponse<{ success: boolean }>>(`/users/${userId}/password`, data);
        return res.data.data.success;
    } catch (error: any) {
        console.error('Failed to change password:', error);
        throw new Error(error?.response?.data?.message || 'Failed to change password');
    }
};

export const getUsers = async (filters: Partial<Pick<User, 'username' | 'email' | 'user_id'>> = {}): Promise<User[]> => {
    try {
        // Convert user_id to id for backend compatibility
        const backendFilters: any = { ...filters };
        if (backendFilters.user_id) {
            backendFilters.id = backendFilters.user_id;
            delete backendFilters.user_id;
        }
        const res = await api.get<ApiResponse<User[]>>('/users', { params: backendFilters });
        return res.data.data;
    } catch (error: any) {
        console.error('Failed to get users:', error);
        throw new Error(error?.response?.data?.message || 'Failed to fetch users');
    }
};
