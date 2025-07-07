import { notifyParticipants } from './notifyParticipants';
import { PATHS } from '../../constants/path.constants';

interface NotifyOnTravelPlanCommentOptions {
    planId: string;
    planName: string;
    participants: { user_id: number }[];
    commenterId: number;
    commenterName: string;
    commentId?: string;
}

export async function notifyOnTravelPlanComment({
    planId,
    planName,
    participants,
    commenterId,
    commenterName,
    commentId
}: NotifyOnTravelPlanCommentOptions) {
    let link = `${window.location.origin}${PATHS.TRAVEL_PLAN_DETAILS.replace(':plan_id', planId)}`;
    if (commentId) link += `#comment-${commentId}`;
    await notifyParticipants({
        participants,
        excludeUserId: commenterId,
        message: `${commenterName} commented on the travel plan: ${planName}`,
        type: 'travelplan_comment',
        link
    });
}
