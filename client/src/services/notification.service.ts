import api from '../utils/api';
import type { Notification, NotificationCreateDto } from '../types/notification.type';

const NOTIFICATION_BASE = '/notifications';

export const createNotification = async (data: NotificationCreateDto) => {
    const res = await api.post<{ data: Notification }>(`${NOTIFICATION_BASE}`, data);
    return res.data.data;
};

export const getUserNotifications = async (userId: number) => {
    const res = await api.get<{ data: Notification[] }>(`${NOTIFICATION_BASE}/user/${userId}`);
    return res.data.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
    const res = await api.patch<{ data: Notification }>(`${NOTIFICATION_BASE}/${notificationId}/read`);
    return res.data.data;
};

export const deleteNotification = async (notificationId: string) => {
    const res = await api.delete<{ data: null }>(`${NOTIFICATION_BASE}/${notificationId}`);
    return res.data.data;
};
