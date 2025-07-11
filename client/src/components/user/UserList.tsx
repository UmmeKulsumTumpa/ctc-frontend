import React from 'react';
import type { User } from '../../types/user.type';
import UserCard from './UserCard';

interface UserListProps {
    users: User[];
    loading?: boolean;
    showActions?: boolean;
    onRoleUpdate?: (userId: number, newRole: string) => void;
    onDelete?: (userId: number) => void;
    emptyMessage?: string;
    className?: string;
}

const UserList: React.FC<UserListProps> = ({
    users,
    loading = false,
    showActions = false,
    onRoleUpdate,
    onDelete,
    emptyMessage = "No users found",
    className = ""
}) => {
    if (loading) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="text-emerald-600 text-xl font-bold animate-pulse">
                    Loading users...
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="text-gray-500 text-lg">
                    {emptyMessage}
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {users.map((user) => (
                <UserCard
                    key={user.user_id}
                    user={user}
                    showActions={showActions}
                    onRoleUpdate={onRoleUpdate}
                    onDelete={onDelete}
                    loading={loading}
                />
            ))}
        </div>
    );
};

export default UserList;
