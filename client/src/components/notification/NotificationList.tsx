import React, { useEffect, useState } from 'react';
import { getUserNotifications, markNotificationAsRead } from '../../services/notification.service';
import { useAuth } from '../../contexts/AuthContext';
import type { Notification } from '../../types/notification.type';

const NotificationList: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const notis = await getUserNotifications(user.user_id);
            setNotifications(notis);
        } catch (err: any) {
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, [user]);

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications(n => n.map(notif => notif.notification_id === notificationId ? { ...notif, read: true } : notif));
        } catch {
            
        }
    };

    if (!user) return null;

    return (
        <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-8">
            <h3 className="text-4xl font-bold text-emerald-900 mb-4">Notifications</h3>
            {loading ? (
                <div className="text-emerald-600 text-lg font-bold animate-pulse py-4">Loading notifications...</div>
            ) : error ? (
                <div className="text-red-600 text-lg font-semibold py-4">{error}</div>
            ) : notifications.length === 0 ? (
                <div className="text-gray-500 text-lg py-4">No notifications yet.</div>
            ) : (
                <ul className="space-y-4">
                    {notifications.map(n => (
                        <li
                            key={n.notification_id}
                            className={`flex items-center justify-between border-2 rounded-xl px-6 py-4 ${n.read ? 'border-gray-200 bg-gray-50' : 'border-emerald-400 bg-emerald-50'}`}
                        >
                            <div className="flex-1">
                                <div className={`font-semibold ${n.read ? 'text-gray-700' : 'text-emerald-900'}`}>{n.message}</div>
                                {(n.type === 'PARTICIPANT_ADDED' || n.type === 'COMMENT_ADDED') && n.data?.plan_id && (
                                    <a
                                        href={`/travelplan/${n.data.plan_id}`}
                                        className="text-blue-900 underline font-bold hover:text-emerald-700 text-sm mt-1 inline-block"
                                    >
                                        View Travel Plan
                                    </a>
                                )}
                                {n.data?.link && (
                                    <a
                                        href={n.data.link}
                                        className="text-blue-900 underline font-bold hover:text-emerald-700 text-sm mt-1 inline-block"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Details
                                    </a>
                                )}
                                <div className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                            </div>
                            {!n.read && (
                                <button
                                    onClick={() => handleMarkAsRead(n.notification_id)}
                                    className="ml-6 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold shadow hover:bg-emerald-900 transition-colors"
                                >
                                    Mark as Read
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationList;
