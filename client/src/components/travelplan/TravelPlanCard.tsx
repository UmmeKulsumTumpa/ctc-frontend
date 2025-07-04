import React, { useEffect, useState } from 'react';
import type { TravelPlan, PlanParticipant, PlanComment, PlannedPlace, TravelPlanServiceUnifiedDTO } from '../../types/travelPlan.type';
import { getPlanParticipants, getPlanComments, getPlannedPlaces, getPlanServices } from '../../services/travelPlan.service';

interface TravelPlanCardProps {
    plan: TravelPlan;
}

const TravelPlanCard: React.FC<TravelPlanCardProps> = ({ plan }) => {
    const [participants, setParticipants] = useState<PlanParticipant[]>([]);
    const [comments, setComments] = useState<PlanComment[]>([]);
    const [places, setPlaces] = useState<PlannedPlace[]>([]);
    const [services, setServices] = useState<TravelPlanServiceUnifiedDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getPlanParticipants(plan.plan_id),
            getPlanComments(plan.plan_id),
            getPlannedPlaces(plan.plan_id),
            getPlanServices(plan.plan_id)
        ])
            .then(([participants, comments, places, services]) => {
                setParticipants(participants);
                setComments(comments);
                setPlaces(places);
                setServices(services);
            })
            .catch(() => setError('Failed to load plan details'))
            .finally(() => setLoading(false));
    }, [plan.plan_id]);

    if (loading) return <div className="p-4">Loading plan details...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div className="border rounded p-4 bg-white shadow mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-2">{plan.name}</h3>
            <div className="text-sm text-gray-600 mb-2">Status: {plan.status || 'N/A'}</div>
            <div className="text-xs text-gray-500 mb-2">Start: {plan.start_date || '-'} | End: {plan.end_date || '-'}</div>
            <div className="mb-2">
                <b>Participants:</b> {participants.length === 0 ? 'None' : participants.map(p => `User ${p.user_id} (${p.role_permission})`).join(', ')}
            </div>
            <div className="mb-2">
                <b>Places:</b> {places.length === 0 ? 'None' : places.map(pl => pl.place_id).join(', ')}
            </div>
            <div className="mb-2">
                <b>Services:</b> {services.length === 0 ? 'None' : services.map(s => s.service_id).join(', ')}
            </div>
            <div className="mb-2">
                <b>Comments:</b>
                <ul className="ml-4 list-disc">
                    {comments.length === 0 ? <li>No comments</li> : comments.map(c => (
                        <li key={c.comment_id}><span className="font-semibold">User {c.user_id}:</span> {c.content}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TravelPlanCard;
