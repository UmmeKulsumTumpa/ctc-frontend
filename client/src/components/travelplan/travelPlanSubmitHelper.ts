import {
    createTravelPlan,
    addPlannedPlace,
    addPlanService,
    addPlanParticipant,
    addPlanComment
} from '../../services/travelPlan.service';

import type {
    CreateTravelPlanRequestDto,
    PlannedPlace,
    TravelPlanServiceUnifiedDTO,
    PlanParticipant,
    PlanComment,
    TravelPlan
} from '../../types/travelPlan.type';

interface SubmitTravelPlanOptions {
    plan: CreateTravelPlanRequestDto;
    places: Partial<PlannedPlace>[];
    services: Partial<TravelPlanServiceUnifiedDTO>[];
    participants: Partial<PlanParticipant>[];
    comments: Partial<PlanComment>[];
}

export async function submitTravelPlanWithSubResources({ plan, places, services, participants, comments }: SubmitTravelPlanOptions) {
    let created: TravelPlan | null = null;
    try {
        created = await createTravelPlan(plan);
        const plan_id = created.plan_id;

        for (const place of places) {
            if (place.place_id) {
                await addPlannedPlace(plan_id, { place_id: place.place_id, priority: place.priority });
            }
        }
        for (const svc of services) {
            if (svc.service_id) {
                await addPlanService(plan_id, svc as TravelPlanServiceUnifiedDTO);
            }
        }
        for (const participant of participants) {
            if (participant.user_id) {
                await addPlanParticipant(plan_id, {
                    user_id: participant.user_id,
                    is_going: participant.is_going,
                    role_permission: participant.role_permission || 'Editor',
                });
            }
        }
        for (const comment of comments) {
            if (comment.content) {
                await addPlanComment(plan_id, { content: comment.content });
            }
        }
        return created;
    } catch (err: any) {
        if (created && created.plan_id) {
            //   await deleteTravelPlan(created.plan_id); // will add when the delete service is implemented
        }
        throw err;
    }
}
