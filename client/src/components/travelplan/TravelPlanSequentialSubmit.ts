import { useState } from 'react';
import { createTravelPlan, addPlannedPlace, addPlanService, addPlanParticipant, addPlanComment } from '../../services/travelPlan.service';
import type { CreateTravelPlanRequestDto, TravelPlan, PlannedPlace, TravelPlanServiceUnifiedDTO, PlanParticipant, PlanComment } from '../../types/travelPlan.type';

export interface TravelPlanSubmission {
    plan: CreateTravelPlanRequestDto;
    places: Partial<PlannedPlace>[];
    services: Partial<TravelPlanServiceUnifiedDTO>[];
    participants: Partial<PlanParticipant>[];
    comments: Partial<PlanComment>[];
}

export function useTravelPlanSequentialSubmit(onCreated?: (plan: TravelPlan) => void) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [detailedError, setDetailedError] = useState<string | null>(null);
    const [createdPlan, setCreatedPlan] = useState<TravelPlan | null>(null);

    // validate the required fields for the sub-resources
    const validatePlan = (plan: Partial<CreateTravelPlanRequestDto>) => !!plan.name;
    const validatePlace = (place: Partial<PlannedPlace>) => !!place.place_id;
    const validateService = (service: Partial<TravelPlanServiceUnifiedDTO>) => !!service.service_id;
    const validateParticipant = (participant: Partial<PlanParticipant>) => !!participant.user_id;
    const validateComment = (comment: Partial<PlanComment>) => !!comment.content;

    const handleSequentialSubmit = async (data: TravelPlanSubmission) => {
        setLoading(true);
        setError(null);
        setDetailedError(null);

        // Validate sub-resources
        const validPlaces = data.places.filter(validatePlace) as PlannedPlace[];
        const validServices = data.services.filter(validateService) as TravelPlanServiceUnifiedDTO[];
        const validParticipants = data.participants.filter(validateParticipant) as PlanParticipant[];
        const validComments = data.comments.filter(validateComment) as PlanComment[];

        // If any sub-resource array has items but none are valid, show error and abort
        if (
            (data.places.length > 0 && validPlaces.length === 0) ||
            (data.services.length > 0 && validServices.length === 0) ||
            (data.participants.length > 0 && validParticipants.length === 0) ||
            (data.comments.length > 0 && validComments.length === 0)
        ) {
            setError('No valid sub-resources to add. Please fill required fields or remove empty forms.');
            setLoading(false);
            return;
        }

        let created: TravelPlan | null = null;
        try {
            const cleanForm = Object.fromEntries(
                Object.entries(data.plan).filter(([_, value]) => value !== undefined && value !== '')
            ) as CreateTravelPlanRequestDto;
            if (!validatePlan(cleanForm)) {
                setError('Travel plan name is required.');
                setLoading(false);
                return;
            }
            created = await createTravelPlan(cleanForm);
            const plan_id = created.plan_id;
            // Places
            for (let i = 0; i < validPlaces.length; i++) {
                const p = validPlaces[i];
                try {
                    await addPlannedPlace(plan_id, { place_id: p.place_id!, priority: p.priority });
                } catch (err: any) {
                    setDetailedError(`Failed to add place #${i + 1}: ${err?.response?.data?.message || err.message}`);
                    setError('Travel plan creation failed: could not add all places.');
                    setLoading(false);
                    return;
                }
            }
            // Services
            for (let i = 0; i < validServices.length; i++) {
                const s = validServices[i];
                try {
                    await addPlanService(plan_id, {
                        service_id: s.service_id!,
                        estimated_cost: s.estimated_cost,
                        planned_visit_date: s.planned_visit_date,
                        notes: s.notes,
                        notify_when_near: s.notify_when_near,
                        created_at: s.created_at,
                        transport_details: s.transport_details || null,
                        plan_id
                    });
                } catch (err: any) {
                    setDetailedError(`Failed to add service #${i + 1}: ${err?.response?.data?.message || err.message}`);
                    setError('Travel plan creation failed: could not add all services.');
                    setLoading(false);
                    return;
                }
            }
            // Participants
            for (let i = 0; i < validParticipants.length; i++) {
                const p = validParticipants[i];
                try {
                    await addPlanParticipant(plan_id, { user_id: p.user_id!, is_going: p.is_going, role_permission: p.role_permission! });
                } catch (err: any) {
                    setDetailedError(`Failed to add participant #${i + 1}: ${err?.response?.data?.message || err.message}`);
                    setError('Travel plan creation failed: could not add all participants.');
                    setLoading(false);
                    return;
                }
            }
            // Comments
            for (let i = 0; i < validComments.length; i++) {
                const c = validComments[i];
                try {
                    await addPlanComment(plan_id, { content: c.content! });
                } catch (err: any) {
                    setDetailedError(`Failed to add comment #${i + 1}: ${err?.response?.data?.message || err.message}`);
                    setError('Travel plan creation failed: could not add all comments.');
                    setLoading(false);
                    return;
                }
            }
            setCreatedPlan(created);
            onCreated?.(created);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to create travel plan');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, detailedError, createdPlan, handleSequentialSubmit };
}
