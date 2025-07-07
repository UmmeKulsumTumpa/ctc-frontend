import { createNotification } from '../../services/notification.service';
import type { NotificationCreateDto } from '../../types/notification.type';

interface NotifyParticipantsOptions {
    participants: { user_id: number }[];
    excludeUserId: number;
    message: string;
    type?: string;
    data?: any;
    link?: string;
}

export async function notifyParticipants({
    participants,
    excludeUserId,
    message,
    type = 'reminder',
    data,
    link
}: NotifyParticipantsOptions) {
    const notifications: Promise<any>[] = [];
    participants.forEach((p) => {
        if (p.user_id !== excludeUserId) {
            const notification: NotificationCreateDto = {
                user_id: p.user_id,
                message,
                type,
                data: link ? { ...data, link } : data
            };
            notifications.push(createNotification(notification));
        }
    });
    await Promise.all(notifications);
}
