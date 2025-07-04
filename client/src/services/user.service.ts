import api from '../utils/api';
import type { ApiResponse } from '../types/api.response.type';
import type { User } from '../types/user.type';
import type { UpdateUserRequest, ChangePasswordRequest } from '../types/user.request.type';

export const getUser = async (userId: number): Promise<User> => {
    const res = await api.get<ApiResponse<User[]>>('/users', { params: { user_id: userId } });
    if (!res.data.data || res.data.data.length === 0) throw new Error('User not found');
    return res.data.data[0];
};

export const updateUser = async (userId: number, data: UpdateUserRequest): Promise<boolean> => {
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
};

export const changePassword = async (userId: number, data: ChangePasswordRequest): Promise<boolean> => {
    const res = await api.patch<ApiResponse<{ success: boolean }>>(`/users/${userId}/password`, data);
    return res.data.data.success;
};

export const getUsers = async (filters: Partial<Pick<User, 'username' | 'email' | 'user_id'>> = {}): Promise<User[]> => {
    const res = await api.get<ApiResponse<User[]>>('/users', { params: filters });
    return res.data.data;
};
