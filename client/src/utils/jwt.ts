import type { User } from '../types/user.type';

export function decodeUserFromToken(token: string): Partial<User> | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            user_id: payload.user_id ? Number(payload.user_id) : undefined,
            email: payload.email,
            role: payload.role,
        };
    } catch {
        return null;
    }
}
