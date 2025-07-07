import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import TravelPlanForm from '../../components/travelplan/TravelPlanForm';
import {
    getTravelPlanById,
    updateTravelPlan,
    getPlanServices,
    updatePlanService,
    deletePlanService,
    addPlanService,
    getPlanParticipants,
    updatePlanParticipant,
    deletePlanParticipant,
    addPlanParticipant,
    getPlannedPlaces,
    addPlannedPlace,
    getPlanComments,
    addPlanComment
} from '../../services/travelPlan.service';
import TravelPlanServicesForm from '../../components/travelplan/TravelPlanServicesForm';
import TravelPlanParticipantsForm from '../../components/travelplan/TravelPlanParticipantsForm';
import TravelPlanPlacesForm from '../../components/travelplan/TravelPlanPlacesForm';
import TravelPlanCommentsForm from '../../components/travelplan/TravelPlanCommentsForm';
import type { UpdateTravelPlanRequestDto, TravelPlanServiceUnifiedDTO, PlanParticipant, PlannedPlace, PlanComment } from '../../types/travelPlan.type';

const TravelPlanEditPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [initialValues, setInitialValues] = useState<Partial<UpdateTravelPlanRequestDto>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [services, setServices] = useState<TravelPlanServiceUnifiedDTO[]>([]);
    const [participants, setParticipants] = useState<PlanParticipant[]>([]);
    const [places, setPlaces] = useState<PlannedPlace[]>([]);
    const [comments, setComments] = useState<PlanComment[]>([]);
    
    const [svcLoading, setSvcLoading] = useState(false);
    const [partLoading, setPartLoading] = useState(false);
    const [placeLoading, setPlaceLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    
    const [showAddService, setShowAddService] = useState(false);
    const [showAddParticipant, setShowAddParticipant] = useState(false);
    const [showAddPlace, setShowAddPlace] = useState(false);
    const [showAddComment, setShowAddComment] = useState(false);
    
    const [newService, setNewService] = useState<any>({});
    const [newParticipant, setNewParticipant] = useState<any>({});
    const [newPlace, setNewPlace] = useState<any>({});
    const [newComment, setNewComment] = useState<any>({});

    useEffect(() => {
        if (!planId) return;
        setLoading(true);
        Promise.all([
            getTravelPlanById(planId),
            getPlanServices(planId),
            getPlanParticipants(planId),
            getPlannedPlaces(planId),
            getPlanComments(planId)
        ])
            .then(([plan, services, participants, places, comments]) => {
                setInitialValues(plan);
                setServices(services);
                setParticipants(participants);
                setPlaces(places);
                setComments(comments);
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

    const handleAddParticipant = async () => {
        if (!planId || !newParticipant.user_id || !user) return;
        setPartLoading(true);
        try {
            const addedParticipant = await addPlanParticipant(planId, {
                user_id: Number(newParticipant.user_id),
                is_going: newParticipant.is_going,
                role_permission: newParticipant.role_permission || 'Viewer'
            }, user.user_id);
            setParticipants(prev => [...prev, addedParticipant]);
            setNewParticipant({});
            setShowAddParticipant(false);
        } catch {
            setError('Failed to add participant.');
        } finally {
            setPartLoading(false);
        }
    };

    const handleAddService = async () => {
        if (!planId || !newService.service_id) return;
        setSvcLoading(true);
        try {
            const addedService = await addPlanService(planId, newService);
            setServices(prev => [...prev, addedService]);
            setNewService({});
            setShowAddService(false);
        } catch {
            setError('Failed to add service.');
        } finally {
            setSvcLoading(false);
        }
    };

    const handleAddPlace = async () => {
        if (!planId || !newPlace.place_id) return;
        setPlaceLoading(true);
        try {
            const addedPlace = await addPlannedPlace(planId, {
                place_id: newPlace.place_id,
                priority: newPlace.priority
            });
            setPlaces(prev => [...prev, addedPlace]);
            setNewPlace({});
            setShowAddPlace(false);
        } catch {
            setError('Failed to add place.');
        } finally {
            setPlaceLoading(false);
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
    
    const handleUpdateParticipant = async (idx: number, data: any) => {
        if (!planId || !user) return;
        setPartLoading(true);
        try {
            const updated = await updatePlanParticipant(planId, data.user_id, data, user.user_id);
            setParticipants(prev => prev.map((p, i) => i === idx ? updated : p));
        } catch {
            setError('Failed to update participant.');
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
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-emerald-800">Plan Services</h3>
                        <button
                            onClick={() => setShowAddService(true)}
                            className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow hover:bg-emerald-700 transition-all"
                        >
                            Add Service
                        </button>
                    </div>

                    {showAddService && (
                        <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-emerald-800">Add New Service</h4>
                                <button
                                    onClick={() => {
                                        setShowAddService(false);
                                        setNewService({});
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                            <TravelPlanServicesForm
                                initialData={newService}
                                onChange={setNewService}
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleAddService}
                                    disabled={svcLoading || !newService.service_id}
                                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {svcLoading ? 'Adding...' : 'Add Service'}
                                </button>
                            </div>
                        </div>
                    )}

                    {services.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No services added yet</div>
                    ) : (
                        <div className="space-y-6">
                            {services.map((svc, idx) => (
                                <div key={svc.service_id ? `${svc.service_id}-${idx}` : `service-${idx}`} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
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
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-xl p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-blue-800">Plan Participants</h3>
                        <button
                            onClick={() => setShowAddParticipant(true)}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all"
                        >
                            Add Participant
                        </button>
                    </div>

                    {showAddParticipant && (
                        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-blue-800">Add New Participant</h4>
                                <button
                                    onClick={() => {
                                        setShowAddParticipant(false);
                                        setNewParticipant({});
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                            <TravelPlanParticipantsForm
                                initialData={newParticipant}
                                onChange={setNewParticipant}
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleAddParticipant}
                                    disabled={partLoading || !newParticipant.user_id}
                                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {partLoading ? 'Adding...' : 'Add Participant'}
                                </button>
                            </div>
                        </div>
                    )}

                    {participants.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No participants added yet</div>
                    ) : (
                        <div className="space-y-6">
                            {participants.map((part, idx) => (
                                <div key={part.user_id ? `${part.user_id}-${idx}` : `participant-${idx}`} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
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

                {/* Places Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-emerald-800">Planned Places</h3>
                        <button
                            onClick={() => setShowAddPlace(true)}
                            className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow hover:bg-emerald-700 transition-all"
                        >
                            Add Place
                        </button>
                    </div>

                    {showAddPlace && (
                        <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-emerald-800">Add New Place</h4>
                                <button
                                    onClick={() => {
                                        setShowAddPlace(false);
                                        setNewPlace({});
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                            <TravelPlanPlacesForm
                                initialData={newPlace}
                                onChange={setNewPlace}
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleAddPlace}
                                    disabled={placeLoading || !newPlace.place_id}
                                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {placeLoading ? 'Adding...' : 'Add Place'}
                                </button>
                            </div>
                        </div>
                    )}

                    {places.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No places added yet</div>
                    ) : (
                        <div className="space-y-6">
                            {places.map((place, idx) => (
                                <div key={place.place_id ? `${place.place_id}-${idx}` : `place-${idx}`} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                                    <div className="p-4 bg-emerald-100 rounded-lg">
                                        <div>
                                            <span className="font-semibold text-emerald-800">Place ID: {place.place_id}</span>
                                            {place.priority && (
                                                <span className="ml-4 px-2 py-1 text-xs bg-emerald-200 text-emerald-800 rounded-full">
                                                    Priority: {place.priority}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-emerald-600 text-sm mt-2">Places can only be added, not removed</p>
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
