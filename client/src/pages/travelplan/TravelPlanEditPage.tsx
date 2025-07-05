import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TravelPlanForm from '../../components/travelplan/TravelPlanForm';
import {
    getTravelPlanById,
    updateTravelPlan,
    getPlanServices,
    updatePlanService,
    deletePlanService,
    getPlanParticipants,
    updatePlanParticipant,
    deletePlanParticipant
} from '../../services/travelPlan.service';
import TravelPlanServicesForm from '../../components/travelplan/TravelPlanServicesForm';
import TravelPlanParticipantsForm from '../../components/travelplan/TravelPlanParticipantsForm';
import type { UpdateTravelPlanRequestDto } from '../../types/travelPlan.type';

const TravelPlanEditPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<Partial<UpdateTravelPlanRequestDto>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [participants, setParticipants] = useState<any[]>([]);
    const [svcLoading, setSvcLoading] = useState(false);
    const [partLoading, setPartLoading] = useState(false);

    useEffect(() => {
        if (!planId) return;
        setLoading(true);
        Promise.all([
            getTravelPlanById(planId),
            getPlanServices(planId),
            getPlanParticipants(planId)
        ])
            .then(([plan, services, participants]) => {
                setInitialValues(plan);
                setServices(services);
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

    if (loading) return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center text-blue-600 text-xl font-semibold">
                    Loading travel plan details...
                </div>
            </div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                    <div className="text-center text-red-700 text-lg font-semibold">{error}</div>
                </div>
            </div>
        </div>
    );
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
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl p-8 mb-8">
                    <h2 className="text-5xl font-bold text-blue-900 mb-2 text-center">Update Travel Plan</h2>
                    <p className="text-xl text-gray-600 text-center mb-8">Modify your travel plan details and settings</p>
                    <TravelPlanForm
                        initialValues={initialValues}
                        onSubmit={handleUpdate}
                        submitLabel="Update Plan"
                    />
                </div>

                {/* Services Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-8 mb-8">
                    <h3 className="text-2xl font-bold text-emerald-800 mb-6">Plan Services</h3>
                    {services.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No services added yet</div>
                    ) : (
                        <div className="space-y-6">
                            {services.map((svc, idx) => (
                                <div key={svc.service_id} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                                    <TravelPlanServicesForm
                                        initialData={svc}
                                        onChange={data => handleUpdateService(idx, { ...svc, ...data })}
                                    />
                                    <div className="mt-4 flex justify-end">
                                        <button 
                                            type="button" 
                                            onClick={() => handleDeleteService(svc.service_id)} 
                                            disabled={svcLoading}
                                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Remove Service
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Participants Section */}
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6">Plan Participants</h3>
                    {participants.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No participants added yet</div>
                    ) : (
                        <div className="space-y-6">
                            {participants.map((part, idx) => (
                                <div key={part.user_id} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                                    <TravelPlanParticipantsForm
                                        initialData={part}
                                        onChange={data => handleUpdateParticipant(idx, { ...part, ...data })}
                                    />
                                    <div className="mt-4 flex justify-end">
                                        <button 
                                            type="button" 
                                            onClick={() => handleDeleteParticipant(part.user_id)} 
                                            disabled={partLoading}
                                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Remove Participant
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TravelPlanEditPage;
