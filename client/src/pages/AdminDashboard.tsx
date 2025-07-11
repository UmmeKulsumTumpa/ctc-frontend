import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../constants/path.constants';
import AdminStats from '../components/admin/AdminStats';
import { getUsers } from '../services/user.service';

const AdminDashboard: React.FC = () => {
    const { canViewAdminDashboard } = useAdminAuth();
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!canViewAdminDashboard) {
            navigate(PATHS.DASHBOARD);
            return;
        }

        const fetchStats = async () => {
            try {
                setLoading(true);
                const users = await getUsers();
                setUserCount(users.length);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [canViewAdminDashboard, navigate]);

    if (!canViewAdminDashboard) {
        return null;
    }

    return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-2xl p-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-emerald-900 mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600 text-lg">Manage your travel platform</p>
                    </div>
                </div>

                <AdminStats
                    userCount={userCount}
                    servicesCount={0}
                    postsCount={0}
                    loading={loading}
                    onUserManagementClick={() => navigate(PATHS.ADMIN_USERS)}
                />

                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-emerald-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate(PATHS.ADMIN_USERS)}
                            className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
                        >
                            <div className="text-emerald-900 font-semibold">Manage Users</div>
                            <div className="text-emerald-600 text-sm">View and manage all users</div>
                        </button>

                        <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl opacity-60 cursor-not-allowed">
                            <div className="text-gray-600 font-semibold">Manage Services</div>
                            <div className="text-gray-400 text-sm">Coming Soon</div>
                        </div>

                        <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl opacity-60 cursor-not-allowed">
                            <div className="text-gray-600 font-semibold">Manage Posts</div>
                            <div className="text-gray-400 text-sm">Coming Soon</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
