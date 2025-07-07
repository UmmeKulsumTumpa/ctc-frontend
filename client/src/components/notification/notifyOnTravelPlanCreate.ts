
import { notifyParticipants } from './notifyParticipants';
import { PATHS } from '../../constants/path.constants';

interface NotifyOnTravelPlanCreateOptions {
    planId: string;
    planName: string;
    participants: { user_id: number }[];
    creatorId: number;
}

export async function notifyOnTravelPlanCreate({
    planId,
    planName,
    participants,
    creatorId
}: NotifyOnTravelPlanCreateOptions) {
    const link = `${window.location.origin}${PATHS.TRAVEL_PLAN_DETAILS.replace(':plan_id', planId)}`;
    await notifyParticipants({
        participants,
        excludeUserId: creatorId,
        message: `You have been invited to join the travel plan: ${planName}`,
        type: 'travelplan_invite',
        link
    });
}
