import React from 'react';
import { FaUsers, FaCog, FaNewspaper } from 'react-icons/fa';

interface AdminStatsProps {
    userCount?: number;
    servicesCount?: number;
    postsCount?: number;
    loading?: boolean;
    onUserManagementClick?: () => void;
    onServicesManagementClick?: () => void;
    onPostsManagementClick?: () => void;
}

const AdminStats: React.FC<AdminStatsProps> = ({
    userCount = 0,
    servicesCount = 0,
    postsCount = 0,
    loading = false,
    onUserManagementClick,
    onServicesManagementClick,
    onPostsManagementClick
}) => {
    const stats = [
        {
            title: 'Total Users',
            count: userCount,
            icon: FaUsers,
            color: 'emerald',
            onClick: onUserManagementClick,
            available: true
        },
        {
            title: 'Services',
            count: servicesCount,
            icon: FaCog,
            color: 'blue',
            onClick: onServicesManagementClick,
            available: false
        },
        {
            title: 'Posts',
            count: postsCount,
            icon: FaNewspaper,
            color: 'purple',
            onClick: onPostsManagementClick,
            available: false
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                
                return (
                    <div
                        key={index}
                        className={`bg-white border-2 border-${stat.color === 'emerald' ? 'emerald' : stat.color === 'blue' ? 'blue' : 'purple'}-200 rounded-xl p-6 shadow-lg ${
                            stat.available && stat.onClick 
                                ? 'hover:shadow-xl cursor-pointer transition-all hover:border-emerald-400' 
                                : stat.available 
                                ? 'cursor-pointer hover:shadow-xl transition-all' 
                                : 'opacity-60 cursor-not-allowed'
                        }`}
                        onClick={stat.available && stat.onClick ? stat.onClick : undefined}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-${stat.color === 'emerald' ? 'emerald' : stat.color === 'blue' ? 'blue' : 'purple'}-600 text-sm font-semibold uppercase tracking-wide`}>
                                    {stat.title}
                                </p>
                                <p className={`text-3xl font-bold text-${stat.color === 'emerald' ? 'emerald' : stat.color === 'blue' ? 'blue' : 'purple'}-900 mt-2`}>
                                    {loading ? '...' : stat.count}
                                </p>
                                {!stat.available && (
                                    <p className="text-gray-400 text-xs mt-1">Coming Soon</p>
                                )}
                            </div>
                            <div className={`p-3 bg-${stat.color === 'emerald' ? 'emerald' : stat.color === 'blue' ? 'blue' : 'purple'}-100 rounded-full`}>
                                <IconComponent className={`w-8 h-8 text-${stat.color === 'emerald' ? 'emerald' : stat.color === 'blue' ? 'blue' : 'purple'}-600`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AdminStats;
