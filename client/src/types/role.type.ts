
export const UserRole = {
    ADMIN: 'admin',
    EXPLORER: 'explorer',
    TRAVELER: 'traveler'
} as const;

export type RoleType = typeof UserRole[keyof typeof UserRole];

export const ROLE_PERMISSIONS = {
    [UserRole.ADMIN]: {
        canManageUsers: true,
        canManageServices: true,
        canManagePosts: true,
        canViewAdminDashboard: true
    },
    [UserRole.EXPLORER]: {
        canManageUsers: false,
        canManageServices: false,
        canManagePosts: false,
        canViewAdminDashboard: false
    },
    [UserRole.TRAVELER]: {
        canManageUsers: false,
        canManageServices: false,
        canManagePosts: false,
        canViewAdminDashboard: false
    }
} as const;
