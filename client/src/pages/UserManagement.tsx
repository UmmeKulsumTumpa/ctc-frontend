import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../constants/path.constants';
import UserList from '../components/user/UserList';
import { getUsers, updateUserRole, deleteUser } from '../services/user.service';
import type { User } from '../types/user.type';

const UserManagement: React.FC = () => {
    const { canManageUsers } = useAdminAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        if (!canManageUsers) {
            navigate(PATHS.DASHBOARD);
            return;
        }

        fetchUsers();
    }, [canManageUsers, navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: number, newRole: string) => {
        try {
            await updateUserRole(userId, newRole);
            await fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Failed to update user role:', error);
            alert('Failed to update user role. Please try again.');
        }
    };

    const handleDelete = async (userId: number) => {
        try {
            await deleteUser(userId);
            await fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user. Please try again.');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = !searchTerm || 
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = !roleFilter || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    if (!canManageUsers) {
        return null;
    }

    return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-2xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-emerald-900 mb-2">User Management</h1>
                            <p className="text-gray-600 text-lg">Manage platform users and their roles</p>
                        </div>
                        <button
                            onClick={() => navigate(PATHS.ADMIN_DASHBOARD)}
                            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            Back to Admin Dashboard
                        </button>
                    </div>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search users by name, username, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border-2 border-emerald-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none bg-white shadow-sm"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="border-2 border-emerald-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none bg-white shadow-sm"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="explorer">Explorer</option>
                            <option value="traveler">Traveler</option>
                        </select>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setRoleFilter('');
                            }}
                            className="px-6 py-3 bg-gray-200 text-gray-800 font-bold border-2 border-gray-300 hover:bg-gray-300 transition-all shadow-sm rounded-xl"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-2xl p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-emerald-900 mb-2">
                            Users ({filteredUsers.length})
                        </h2>
                        <p className="text-gray-600">
                            Manage user roles and accounts
                        </p>
                    </div>

                    <UserList
                        users={filteredUsers}
                        loading={loading}
                        showActions={true}
                        onRoleUpdate={handleRoleUpdate}
                        onDelete={handleDelete}
                        emptyMessage={searchTerm || roleFilter ? "No users match the current filters" : "No users found"}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
