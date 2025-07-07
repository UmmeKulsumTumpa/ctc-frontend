import api from '../utils/api';
import type { Notification, NotificationCreateDto } from '../types/notification.type';
import { getPlanParticipants, getTravelPlanById } from './travelPlan.service';

const NOTIFICATION_BASE = '/notifications';

export const createNotification = async (data: NotificationCreateDto) => {
    try {
        const payload = {
            ...data,
            user_id: Number(data.user_id)
        };

        if (!payload.user_id || isNaN(payload.user_id)) {
            throw new Error(`Invalid user_id: ${data.user_id}`);
        }
        if (!payload.message || typeof payload.message !== 'string' || !payload.message.trim()) {
            throw new Error(`Invalid message: ${data.message}`);
        }
        if (!payload.type || typeof payload.type !== 'string') {
            throw new Error(`Invalid type: ${data.type}`);
        }

        const res = await api.post<{ data: Notification }>(`${NOTIFICATION_BASE}`, payload);
        return res.data.data;
    } catch (error: any) {
        console.error('Notification creation failed:', {
            error: error.response?.data || error.message,
            status: error.response?.status,
            payload: data
        });
        throw error;
    }
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

export const notifyParticipantAdded = async (planId: string, addedUserId: number, currentUserId: number) => {
    try {
        const plan = await getTravelPlanById(planId);
        
        const notificationData: NotificationCreateDto = {
            user_id: Number(addedUserId),
            message: `You have been added to the travel plan: ${plan.name}`,
            type: 'PARTICIPANT_ADDED',
            data: {
                plan_id: planId,
                plan_name: plan.name,
                added_by: Number(currentUserId)
            }
        };

        await createNotification(notificationData);
    } catch (error: any) {
        console.error('Failed to send participant notification:', error.response?.data || error.message);
    }
};

export const notifyCommentAdded = async (planId: string, commenterId: number, commentContent: string) => {
    try {
        const [plan, participants] = await Promise.all([
            getTravelPlanById(planId),
            getPlanParticipants(planId)
        ]);

        const participantsToNotify = participants.filter(p => p.user_id !== commenterId);

        if (participantsToNotify.length === 0) {
            return;
        }

        const notificationPromises = participantsToNotify.map(participant => {
            const notificationData: NotificationCreateDto = {
                user_id: Number(participant.user_id),
                message: `New comment added to travel plan: ${plan.name}`,
                type: 'COMMENT_ADDED',
                data: {
                    plan_id: planId,
                    plan_name: plan.name,
                    commenter_id: Number(commenterId),
                    comment_preview: commentContent.substring(0, 100) + (commentContent.length > 100 ? '...' : '')
                }
            };

            return createNotification(notificationData);
        });

        await Promise.all(notificationPromises);
    } catch (error: any) {
        console.error('Failed to send comment notifications:', error.response?.data || error.message);
    }
};
