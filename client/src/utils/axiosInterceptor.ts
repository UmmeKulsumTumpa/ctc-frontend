import api from './api';
import * as storage from './storage';
import * as authService from '../services/auth.service';

export const setupAxiosInterceptors = (onSignOut?: () => void) => {
    api.interceptors.request.use(
        (config) => {
            const token = storage.getAccessToken();
            if (token && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (
                error.response &&
                error.response.status === 401 &&
                !originalRequest._retry &&
                storage.getRefreshToken() &&
                !storage.isRefreshTokenExpired()
            ) {
                originalRequest._retry = true;
                try {
                    const { accessToken } = await authService.refreshAccessToken(storage.getRefreshToken()!);
                    const atExpiry = (() => {
                        try {
                            const payload = JSON.parse(atob(accessToken.split('.')[1]));
                            return payload.exp ? payload.exp * 1000 : undefined;
                        } catch {
                            return undefined;
                        }
                    })();
                    storage.setTokens(accessToken, storage.getRefreshToken()!, atExpiry, storage.getRefreshTokenExpiry() || undefined);
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    storage.clearTokens();
                    if (onSignOut) onSignOut();
                }
            }
            return Promise.reject(error);
        }
    );
};
