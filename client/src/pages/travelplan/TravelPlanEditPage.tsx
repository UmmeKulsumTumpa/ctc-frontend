import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TravelPlanForm from '../../components/travelplan/TravelPlanForm';
import {
    getTravelPlanById,
    updateTravelPlan,
    getPlanServices,
    updatePlanService,
    deletePlanService,
    getPlannedPlaces,
    getPlanParticipants,
    updatePlanParticipant,
    deletePlanParticipant
} from '../../services/travelPlan.service';
import TravelPlanServicesForm from '../../components/travelplan/TravelPlanServicesForm';
import TravelPlanParticipantsForm from '../../components/travelplan/TravelPlanParticipantsForm';
import type { UpdateTravelPlanRequestDto, TravelPlan } from '../../types/travelPlan.type';

const TravelPlanEditPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<Partial<UpdateTravelPlanRequestDto>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [places, setPlaces] = useState<any[]>([]);
    const [participants, setParticipants] = useState<any[]>([]);
    const [svcLoading, setSvcLoading] = useState(false);
    const [partLoading, setPartLoading] = useState(false);

    useEffect(() => {
        if (!planId) return;
        setLoading(true);
        Promise.all([
            getTravelPlanById(planId),
            getPlanServices(planId),
            getPlannedPlaces(planId),
            getPlanParticipants(planId)
        ])
            .then(([plan, services, places, participants]) => {
                setInitialValues(plan);
                setServices(services);
                setPlaces(places);
                setParticipants(participants);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load travel plan.');
                setLoading(false);
            });
    }, [planId]);

    const handleUpdate = async (values: UpdateTravelPlanRequestDto) => {
        if (!planId) return;
        try {
            await updateTravelPlan(planId, values);
            navigate(`/travelplan/${planId}`);
        } catch (e) {
            setError('Failed to update travel plan.');
        }
    };

    if (loading) return <div className="text-center py-16 text-blue-600 text-xl font-bold animate-pulse">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-16 text-lg font-semibold">{error}</div>;
    if (!initialValues) return null;

    const handleUpdateService = async (idx: number, data: any) => {
        if (!planId) return;
        setSvcLoading(true);
        try {
            const updated = await updatePlanService(planId, data.service_id, data);
            setServices(prev => prev.map((s, i) => i === idx ? updated : s));
        } catch {
            setError('Failed to update service.');
        } finally {
            setSvcLoading(false);
        }
    };
    
    const handleDeleteService = async (service_id: string) => {
        if (!planId) return;
        setSvcLoading(true);
        try {
            await deletePlanService(planId, service_id);
            setServices(prev => prev.filter(s => s.service_id !== service_id));
        } catch {
            setError('Failed to delete service.');
        } finally {
            setSvcLoading(false);
        }
    };

    const handleUpdateParticipant = async (idx: number, data: any) => {
        if (!planId) return;
        setPartLoading(true);
        try {
            const updated = await updatePlanParticipant(planId, data.user_id, data);
            setParticipants(prev => prev.map((p, i) => i === idx ? updated : p));
        } catch {
            setError('Failed to update participant.');
        } finally {
            setPartLoading(false);
        }
    };

    const handleDeleteParticipant = async (user_id: number) => {
        if (!planId) return;
        setPartLoading(true);
        try {
            await deletePlanParticipant(planId, user_id);
            setParticipants(prev => prev.filter(p => p.user_id !== user_id));
        } catch {
            setError('Failed to delete participant.');
        } finally {
            setPartLoading(false);
        }
    };

    return (
        <div className="py-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800 font-serif tracking-tight drop-shadow-lg">Edit Travel Plan</h2>
            <TravelPlanForm
                initialValues={initialValues}
                onSubmit={handleUpdate}
                submitLabel="Update"
            />

            <div className="mt-10">
                <h3 className="text-xl font-bold mb-3 text-green-800">Services</h3>
                <ul className="space-y-4">
                    {services.map((svc, idx) => (
                        <li key={svc.service_id} className="flex flex-col gap-2 border-b border-blue-100 pb-3">
                            <TravelPlanServicesForm
                                initialData={svc}
                                onChange={data => handleUpdateService(idx, { ...svc, ...data })}
                            />
                            <button type="button" onClick={() => handleDeleteService(svc.service_id)} className="self-end px-3 py-1 text-xs bg-red-400 text-white rounded-lg shadow hover:bg-red-500 transition">Delete</button>
                        </li>
                    ))}
                </ul>
                <h3 className="text-xl font-bold mb-3 mt-10 text-blue-800">Participants</h3>
                <ul className="space-y-4">
                    {participants.map((part, idx) => (
                        <li key={part.user_id} className="flex flex-col gap-2 border-b border-blue-100 pb-3">
                            <TravelPlanParticipantsForm
                                initialData={part}
                                onChange={data => handleUpdateParticipant(idx, { ...part, ...data })}
                            />
                            <button type="button" onClick={() => handleDeleteParticipant(part.user_id)} className="self-end px-3 py-1 text-xs bg-red-400 text-white rounded-lg shadow hover:bg-red-500 transition">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TravelPlanEditPage;
