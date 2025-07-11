import React from 'react';
import type { User } from '../../types/user.type';
import { UserRoleIcons } from '../icons/commonIcons';
import { UserRole } from '../../types/role.type';

interface UserCardProps {
    user: User;
    showActions?: boolean;
    onRoleUpdate?: (userId: number, newRole: string) => void;
    onDelete?: (userId: number) => void;
    loading?: boolean;
    className?: string;
}

const UserCard: React.FC<UserCardProps> = ({ 
    user, 
    showActions = false, 
    onRoleUpdate, 
    onDelete, 
    loading = false,
    className = ""
}) => {
    const validRoles = ['admin', 'explorer', 'traveler'] as const;
    const userRole = user.role && validRoles.includes(user.role as any) ? user.role as keyof typeof UserRoleIcons : 'traveler';
    const RoleIcon = UserRoleIcons[userRole];

    const handleRoleChange = (newRole: string) => {
        if (onRoleUpdate && user.user_id) {
            onRoleUpdate(Number(user.user_id), newRole);
        }
    };

    const handleDelete = () => {
        if (onDelete && user.user_id && window.confirm(`Are you sure you want to delete user "${user.username || user.email}"?`)) {
            onDelete(Number(user.user_id));
        }
    };

    return (
        <div className={`bg-white border-2 border-emerald-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                    {user.profile_picture ? (
                        <img
                            src={user.profile_picture}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-300"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center">
                            <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-emerald-900">
                                {user.username || user.email}
                            </h3>
                            <div className="flex items-center gap-1 bg-emerald-50 rounded-full px-3 py-1 border border-emerald-200">
                                <RoleIcon className="text-emerald-600 w-4 h-4" />
                                <span className="text-emerald-900 font-semibold text-sm capitalize">{user.role || 'User'}</span>
                            </div>
                        </div>

                        <p className="text-gray-600 mb-1">{user.email}</p>
                        
                        {(user.first_name || user.last_name) && (
                            <p className="text-gray-700 font-medium">
                                {[user.first_name, user.last_name].filter(Boolean).join(' ')}
                            </p>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span>ID: {user.user_id}</span>
                            <span>Status: {user.is_active ? 'Active' : 'Inactive'}</span>
                            {user.created_at && (
                                <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                            )}
                        </div>
                    </div>
                </div>

                {showActions && (
                    <div className="flex flex-col gap-3 ml-4">
                        <select
                            value={user.role || UserRole.TRAVELER}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            disabled={loading}
                            className="border-2 border-emerald-300 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none bg-white"
                        >
                            {Object.values(UserRole).map(role => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCard;
