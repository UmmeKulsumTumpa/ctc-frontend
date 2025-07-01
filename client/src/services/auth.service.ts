import api from '../utils/api';
import type { ApiResponse } from '../types/api.response.type';
import type { AuthResponseData } from '../types/auth.response.type';
import type { User } from '../types/user.type';

export const signIn = async (email: string, password: string): Promise<AuthResponseData> => {
    try {
        const res = await api.post<ApiResponse<AuthResponseData>>('/users/login', { email, password });
        return res.data.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || 'Failed to sign in.');
    }
};

export const signUp = async (data: Partial<User> & { password: string }): Promise<AuthResponseData> => {
    try {
        const res = await api.post<ApiResponse<AuthResponseData>>('/users', data);
        return res.data.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || 'Failed to sign up.');
    }
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
    try {
        const res = await api.post<ApiResponse<{ accessToken: string }>>('/users/refresh', { refreshToken });
        return res.data.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || 'Failed to refresh access token.');
    }
};

export const signOut = async () => {
    try {
        await api.post('/users/logout');
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || 'Failed to sign out.');
    }
};
