import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { UserRole, ROLE_PERMISSIONS } from '../types/role.type';
import type { RoleType } from '../types/role.type';

interface AdminAuthContextType {
    isAdmin: boolean;
    canManageUsers: boolean;
    canManageServices: boolean;
    canManagePosts: boolean;
    canViewAdminDashboard: boolean;
    hasPermission: (permission: keyof typeof ROLE_PERMISSIONS[typeof UserRole.ADMIN]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    const adminAuthValue = useMemo(() => {
        const userRole = user?.role as RoleType | undefined;
        const isValidRole = userRole && Object.values(UserRole).includes(userRole);
        const permissions = isValidRole && userRole ? ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] : ROLE_PERMISSIONS[UserRole.USER];

        return {
            isAdmin: userRole === UserRole.ADMIN,
            canManageUsers: permissions.canManageUsers,
            canManageServices: permissions.canManageServices,
            canManagePosts: permissions.canManagePosts,
            canViewAdminDashboard: permissions.canViewAdminDashboard,
            hasPermission: (permission: keyof typeof ROLE_PERMISSIONS[typeof UserRole.ADMIN]) => {
                return permissions[permission] || false;
            }
        };
    }, [user?.role]);

    return (
        <AdminAuthContext.Provider value={adminAuthValue}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = (): AdminAuthContextType => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
};
