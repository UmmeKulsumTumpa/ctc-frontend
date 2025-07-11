export const UserRole = {
    ADMIN: 'admin',
    USER: 'user',
    EXPLORER: 'explorer',
    PLANNER: 'planner'
} as const;

export type RoleType = typeof UserRole[keyof typeof UserRole];

export const ROLE_PERMISSIONS = {
    [UserRole.ADMIN]: {
        canManageUsers: true,
        canManageServices: true,
        canManagePosts: true,
        canViewAdminDashboard: true
    },
    [UserRole.USER]: {
        canManageUsers: false,
        canManageServices: false,
        canManagePosts: false,
        canViewAdminDashboard: false
    },
    [UserRole.EXPLORER]: {
        canManageUsers: false,
        canManageServices: false,
        canManagePosts: false,
        canViewAdminDashboard: false
    },
    [UserRole.PLANNER]: {
        canManageUsers: false,
        canManageServices: false,
        canManagePosts: false,
        canViewAdminDashboard: false
    }
} as const;
