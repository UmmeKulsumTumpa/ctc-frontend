import React from 'react';
import type { User } from '../../types/user.type';

interface UserProfileProps {
    user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg mx-auto">
            <div className="flex flex-col items-center gap-2">
                {user.profile_picture && (
                    <img
                        src={user.profile_picture}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-blue-400 mb-2"
                    />
                )}
                <h2 className="text-2xl font-bold text-blue-900">
                    {user.username || user.email}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-700">
                    {[user.first_name, user.last_name].filter(Boolean).join(' ')}
                </p>
                {user.age !== undefined && user.age !== null && user.age !== 0 && (
                    <p className="text-gray-500">Age: {user.age}</p>
                )}
                {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
                {user.role && <p className="text-xs text-blue-400 mt-2">Role: {user.role}</p>}
                {user.created_at && (
                    <p className="text-xs text-gray-400">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
