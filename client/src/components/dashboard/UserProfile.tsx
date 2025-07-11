import React from 'react';
import type { User } from '../../types/user.type';
import { UserRoleIcons } from '../icons/commonIcons';

interface UserProfileProps {
    user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const validRoles = ['admin', 'user', 'explorer'] as const;
    const userRole = user.role && validRoles.includes(user.role as any) ? user.role as keyof typeof UserRoleIcons : 'user';
    const RoleIcon = UserRoleIcons[userRole];
    
    return (
        <div className="w-full max-w-2xl mx-auto relative">
            <div className="absolute flex items-center gap-2 bg-white rounded-full shadow px-4 py-2 border border-emerald-200 z-10">
                <RoleIcon className="text-emerald-600 w-6 h-6" />
                <span className="text-emerald-900 font-bold capitalize">{user.role || 'User'}</span>
            </div>

            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-emerald-900 mb-2">Travel Profile</h3>
                <p className="text-gray-600 text-lg">Your adventure identity</p>
            </div>

            <div className="flex flex-col items-center gap-6">
                {user.profile_picture ? (
                    <div className="relative">
                        <img
                            src={user.profile_picture}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-emerald-400 shadow-lg"
                        />
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-full bg-emerald-100 border-4 border-emerald-400 shadow-lg flex items-center justify-center">
                        <svg className="w-16 h-16 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}

                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-bold text-emerald-900">
                        {user.username || user.email}
                    </h2>
                    <div className="bg-emerald-50 rounded-xl px-4 py-2 border border-emerald-200">
                        <p className="text-emerald-700 font-semibold">{user.email}</p>
                    </div>
                </div>

                {(user.first_name || user.last_name) && (
                    <div className="bg-sky-50 rounded-xl px-6 py-3 border border-sky-200">
                        <p className="text-sky-900 font-bold text-lg">
                            {[user.first_name, user.last_name].filter(Boolean).join(' ')}
                        </p>
                    </div>
                )}

                {user.bio && (
                    <div className="bg-gray-50 rounded-xl px-6 py-4 border border-gray-200 w-full max-w-md">
                        <h4 className="font-bold text-gray-800 mb-2">About Me</h4>
                        <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                    <div className="bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-200 text-center">
                        <p className="text-emerald-900 font-bold">Account Status</p>
                        <p className="text-emerald-700">Active</p>
                    </div>
                    <div className="bg-sky-50 rounded-xl px-4 py-3 border border-sky-200 text-center">
                        <p className="text-sky-900 font-bold">Member Since</p>
                        <p className="text-sky-700">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
