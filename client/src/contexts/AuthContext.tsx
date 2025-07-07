import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as storage from '../utils/storage';
import * as authService from '../services/auth.service';
import { setupAxiosInterceptors } from '../utils/axiosInterceptor';
import { decodeUserFromToken } from '../utils/jwt';
import type { User } from '../types/user.type';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (data: Partial<User> & { password: string }) => Promise<void>;
    signOut: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(storage.getAccessToken());
    const [refreshToken, setRefreshToken] = useState<string | null>(storage.getRefreshToken());
    const [loading, setLoading] = useState(true);

    const getTokenExpiry = (token: string): number | undefined => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp ? payload.exp * 1000 : undefined;
        } catch {
            return undefined;
        }
    };

    const mapDecodedToUser = (decoded: Partial<User> | null): User | null => {
        if (!decoded || typeof decoded.user_id !== 'number' || !decoded.email || !decoded.role) return null;
        return {
            user_id: decoded.user_id,
            email: decoded.email,
            role: decoded.role,
            username: decoded.username || '',
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            age: decoded.age,
            profile_picture: decoded.profile_picture,
            bio: decoded.bio,
            last_login: decoded.last_login,
            is_active: decoded.is_active ?? true,
            created_at: decoded.created_at || '',
            updated_at: decoded.updated_at || '',
        };
    };

    const handleSignIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await authService.signIn(email, password);

            const atExpiry = getTokenExpiry(res.accessToken);
            storage.setTokens(res.accessToken, res.refreshToken, atExpiry);
            setAccessToken(res.accessToken);
            setRefreshToken(res.refreshToken);

            const decodedUser = decodeUserFromToken(res.accessToken);

            const mappedUser = mapDecodedToUser(decodedUser);

            setUser(mappedUser);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (data: Partial<User> & { password: string }) => {
        setLoading(true);
        try {
            const res = await authService.signUp(data);
            const atExpiry = getTokenExpiry(res.accessToken);
            storage.setTokens(res.accessToken, res.refreshToken, atExpiry);
            setAccessToken(res.accessToken);
            setRefreshToken(res.refreshToken);
            setUser(mapDecodedToUser(decodeUserFromToken(res.accessToken)));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkTokens = async () => {
            const at = storage.getAccessToken();
            const rt = storage.getRefreshToken();
            if (at && rt) {
                if (storage.isAccessTokenExpired()) {
                    try {
                        const { accessToken: newAT } = await authService.refreshAccessToken(rt);
                        const newATExpiry = getTokenExpiry(newAT);
                        storage.setTokens(newAT, rt, newATExpiry, storage.getRefreshTokenExpiry() || undefined);
                        setAccessToken(newAT);
                        setUser(mapDecodedToUser(decodeUserFromToken(newAT)));
                    } catch {
                        handleSignOut();
                        setLoading(false);
                        return;
                    }
                } else {
                    setAccessToken(at);
                    setUser(mapDecodedToUser(decodeUserFromToken(at)));
                }
                setRefreshToken(rt);
            } else {
                handleSignOut();
            }
            setLoading(false);
        };
        checkTokens();
    }, []);

    useEffect(() => {
        setupAxiosInterceptors(handleSignOut);
    }, []);

    const handleSignOut = async () => {
        setLoading(true);
        try {
            // Only attempt logout if we have valid tokens
            if (accessToken && !storage.isAccessTokenExpired()) {
                await authService.signOut();
            }
        } catch (error) {
            // Log error but don't prevent logout
            console.warn('Logout failed:', error);
        }
        storage.clearTokens();
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        setLoading(false);
    };

    const value: AuthContextType = {
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken && !storage.isAccessTokenExpired(),
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
