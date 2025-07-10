import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

const ProtectedRoute = ({ children, redirectTo = '/signin' }: ProtectedRouteProps) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null; 
    return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
