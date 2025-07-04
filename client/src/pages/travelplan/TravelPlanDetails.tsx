import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTravelPlanById, getPlanParticipants, getPlanComments, getPlannedPlaces, getPlanServices } from '../../services/travelPlan.service';
import { getUser } from '../../services/user.service';
import { getPlaceById } from '../../services/place.service';
import { getServiceById } from '../../services/service.service';
import ServiceCard from '../../components/service/ServiceCard';
import PlaceCard from '../../components/place/PlaceCard';
import type { TravelPlan, PlanParticipant, PlanComment } from '../../types/travelPlan.type';
import type { User } from '../../types/user.type';
import type { PlaceDto } from '../../types/place.type';
import type { ServiceResponseDto } from '../../types/service.type';

const TravelPlanDetails: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const [plan, setPlan] = useState<TravelPlan | null>(null);
    const [participants, setParticipants] = useState<(PlanParticipant & { user: User | null; idx: number })[]>([]);
    const [comments, setComments] = useState<(PlanComment & { user: User | null })[]>([]);
    const [places, setPlaces] = useState<PlaceDto[]>([]);
    const [services, setServices] = useState<ServiceResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!planId) return;
        setLoading(true);
        setError(null);
        (async () => {
            try {
                const plan = await getTravelPlanById(planId);
                setPlan(plan);
                const [rawParticipants, rawComments, plannedPlaces, planServices] = await Promise.all([
                    getPlanParticipants(planId),
                    getPlanComments(planId),
                    getPlannedPlaces(planId),
                    getPlanServices(planId)
                ]);

                const participantsWithUser = await Promise.all(
                    rawParticipants.map(async (p, idx) => {
                        try {
                            const user = await getUser(p.user_id);
                            return { ...p, user, idx };
                        } catch {
                            return { ...p, user: null, idx };
                        }
                    })
                );
                setParticipants(participantsWithUser);

                const commentsWithUser = await Promise.all(
                    rawComments.map(async c => {
                        try {
                            const user = await getUser(c.user_id);
                            return { ...c, user };
                        } catch {
                            return { ...c, user: null };
                        }
                    })
                );
                setComments(commentsWithUser);

                const placesFetched = await Promise.all(
                    plannedPlaces.map(async pl => {
                        try {
                            return await getPlaceById(pl.place_id);
                        } catch {
                            return null;
                        }
                    })
                );
                setPlaces(placesFetched.filter(Boolean) as PlaceDto[]);

                const servicesFetched = await Promise.all(
                    planServices.map(async s => {
                        try {
                            return await getServiceById(s.service_id);
                        } catch {
                            setError(`Service with id ${s.service_id} not found in service module.`);
                            return null;
                        }
                    })
                );
                setServices(servicesFetched.filter(Boolean) as ServiceResponseDto[]);
            } catch (err: any) {
                setError('Failed to load travel plan details.');
            } finally {
                setLoading(false);
            }
        })();
    }, [planId]);

    if (loading) return <div className="p-8 text-lg text-gray-600 animate-pulse">Loading travel plan details...</div>;
    if (error) return <div className="p-8 text-red-600 font-semibold bg-red-100 border border-red-300 rounded-md">{error}</div>;
    if (!plan) return <div className="p-8 text-gray-700">Travel plan not found.</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-10 border border-gray-200">
            <h1 className="text-4xl font-extrabold text-blue-900 mb-6">{plan.name}</h1>
            <div className="text-gray-600 mb-4 space-x-4">
                <span>Status: <span className="text-blue-700 font-medium">{plan.status || 'N/A'}</span></span>
                <span>| Start: {plan.start_date || '-'}</span>
                <span>| End: {plan.end_date || '-'}</span>
            </div>

            {/* Participants */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4 border-b pb-2">👥 Participants</h2>
                <ul className="space-y-3">
                    {participants.length === 0 ? <li className="text-gray-500">No participants</li> : participants.map(p => (
                        <li key={p.idx} className="p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition">
                            <span className="font-bold text-blue-700">{p.user?.username || `User ${p.user_id}`}</span>
                            <span className="ml-2 text-xs text-gray-500">({p.role_permission})</span>
                            <div className="text-sm text-gray-600">
                                {p.user?.email && <span>{p.user.email}</span>}
                                <span className="ml-3 italic">{p.is_going ? 'Going ✅' : 'Not going ❌'}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Places */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4 border-b pb-2">Places</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {places.length === 0 ? <div className="text-gray-500">No places</div> : places.map(place => (
                        <PlaceCard key={place.place_id} place={place} />
                    ))}
                </div>
            </section>

            {/* Services */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4 border-b pb-2"> Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.length === 0 ? <div className="text-gray-500">No services</div> : services.map(service => (
                        <ServiceCard key={service.service_id} service={service} />
                    ))}
                </div>
            </section>

            {/* Comments */}
            <section className="mb-4">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4 border-b pb-2">💬 Comments</h2>
                <ul className="space-y-3">
                    {comments.length === 0 ? <li className="text-gray-500">No comments</li> : comments.map(c => (
                        <li key={c.comment_id} className="bg-gray-50 p-4 rounded-md shadow-sm hover:bg-gray-100 transition">
                            <span className="font-semibold text-blue-700">{c.user?.username || `User ${c.user_id}`}</span>:&nbsp;
                            <span className="text-gray-700">{c.content}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default TravelPlanDetails;
