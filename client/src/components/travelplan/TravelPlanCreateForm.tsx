import { notifyOnTravelPlanComment } from '../notification/notifyOnTravelPlanComment';
import { getPlanParticipants } from '../../services/travelPlan.service';
import React, { useState } from 'react';
import TravelPlanForm from './TravelPlanForm';
import TravelPlanPlacesForm from './TravelPlanPlacesForm';
import TravelPlanServicesForm from './TravelPlanServicesForm';
import TravelPlanParticipantsForm from './TravelPlanParticipantsForm';
import TravelPlanCommentsForm from './TravelPlanCommentsForm';
import { submitTravelPlanWithSubResources } from './travelPlanSubmitHelper';
import { cleanPayload } from '../../utils/payload';
import type { TravelPlan, CreateTravelPlanRequestDto, PlanParticipant } from '../../types/travelPlan.type';
import { useAuth } from '../../contexts/AuthContext';
import { notifyOnTravelPlanCreate } from '../notification/notifyOnTravelPlanCreate';

interface TravelPlanCreateFormProps {
    onCreated?: (plan: TravelPlan) => void;
    prefill?: {
        place_id?: string;
        participants?: { user_id: string; role: string }[];
    };
}

const TravelPlanCreateForm: React.FC<TravelPlanCreateFormProps> = ({ onCreated, prefill }) => {
    const { user } = useAuth();
    const [places, setPlaces] = useState<any[]>(
        prefill?.place_id ? [{ place_id: prefill.place_id }] : []
    );
    const [services, setServices] = useState<any[]>([]);
    const [participants, setParticipants] = useState<any[]>(
        prefill?.participants
            ? prefill.participants.map(p => ({ user_id: Number(p.user_id), role_permission: p.role }))
            : []
    );
    const [comments, setComments] = useState<any[]>([]);
    const [formErrors, setFormErrors] = useState<{ places: boolean[], services: boolean[], participants: boolean[], comments: boolean[] }>({ places: [], services: [], participants: [], comments: [] });
    const [error, setError] = useState<string | null>(null);
    const [detailedError, setDetailedError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [createdPlan, setCreatedPlan] = useState<TravelPlan | null>(null);

    // Validation functions for sub-resources
    const validatePlace = (place: any) => !!place.place_id;
    const validateService = (service: any) => !!service.service_id;
    const validateParticipant = (participant: any) => !!participant.user_id;
    const validateComment = (comment: any) => !!comment.content;

    // Add sub-resource form logic
    const handleAddPlace = () => setPlaces([...places, {}]);
    const handleAddService = () => setServices([...services, {}]);
    const handleAddParticipant = () => setParticipants([...participants, {}]);
    const handleAddComment = () => setComments([...comments, {}]);

    // Main submit logic
    const handleSubmit = async (data: any) => {
        setLoading(true);
        setError(null);
        setDetailedError(null);

        const validPlaces = places.map(validatePlace);
        const validServices = services.map(validateService);
        const validParticipants = participants.map(validateParticipant);
        const validComments = comments.map(validateComment);
        setFormErrors({
            places: validPlaces.map(v => !v),
            services: validServices.map(v => !v),
            participants: validParticipants.map(v => !v),
            comments: validComments.map(v => !v),
        });

        // Clean all data before submit
        const cleanedPlan = cleanPayload(data) as CreateTravelPlanRequestDto;
        const placesToAdd = places.filter(validatePlace).map((p) => cleanPayload(p));
        const servicesToAdd = services.filter(validateService).map((s) => cleanPayload(s));
        const participantsToAdd = participants.filter(validateParticipant).map((p) => cleanPayload(p));
        const commentsToAdd = comments.filter(validateComment).map((c) => cleanPayload(c));

        if (!cleanedPlan.name || cleanedPlan.name.trim() === "") {
            setError("Name is required.");
            setLoading(false);
            return;
        }

        if (
            (places.length > 0 && placesToAdd.length === 0) &&
            (services.length > 0 && servicesToAdd.length === 0) &&
            (participants.length > 0 && participantsToAdd.length === 0) &&
            (comments.length > 0 && commentsToAdd.length === 0)
        ) {
            setError("No valid sub-resources to add. Please fill required fields or remove empty forms.");
            setLoading(false);
            return;
        }

        try {
            const created = await submitTravelPlanWithSubResources({
                plan: cleanedPlan,
                places: placesToAdd,
                services: servicesToAdd,
                participants: participantsToAdd,
                comments: commentsToAdd,
            });
            setCreatedPlan(created ?? null);

            if (created && user) {
                const planId = created.plan_id;
                const planName = created.name;
                const notifyParticipantsList: { user_id: number }[] = participantsToAdd.map((p: any) => ({ user_id: Number(p.user_id) }));
                await notifyOnTravelPlanCreate({
                    planId,
                    planName,
                    participants: notifyParticipantsList,
                    creatorId: user.user_id
                });
            }
            
            if (created && user && commentsToAdd.length > 0) {
                const planId = created.plan_id;
                const planName = created.name;
                const participantsList = await getPlanParticipants(planId);
                await notifyOnTravelPlanComment({
                    planId,
                    planName,
                    participants: participantsList,
                    commenterId: user.user_id,
                    commenterName: user.username || user.email
                });
            }
            if (created && onCreated) onCreated(created);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create travel plan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-6">
            {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-6 py-4 mb-6 font-semibold text-center">
                    {error}
                </div>
            )}
            {detailedError && (
                <div className="bg-red-50 border-2 border-red-200 text-red-600 rounded-xl px-6 py-3 mb-6 text-sm text-center">
                    {detailedError}
                </div>
            )}

            <div className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl p-8 mb-8">
                <TravelPlanForm onSubmit={handleSubmit} submitLabel={loading ? "Creating Plan..." : "Create Plan"} />
            </div>


            <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-8">
                {/* PLACES */}
                <h3 className="text-3xl font-bold mb-4 text-emerald-900">Destinations</h3>
                <p className="text-emerald-700 mb-6">Add the places you want to visit during your trip</p>
                <button 
                    type="button" 
                    onClick={handleAddPlace} 
                    className="mb-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-colors"
                >
                    Add Destination
                </button>
                <div className="space-y-6">
                    {places.map((place, idx) => (
                        <div key={idx} className="relative">
                            <TravelPlanPlacesForm
                                initialData={place}
                                onChange={data => {
                                    const updated = [...places];
                                    updated[idx] = data;
                                    setPlaces(updated);
                                }}
                                formError={formErrors.places[idx]}
                            />
                            {formErrors.places[idx] && (
                                <div className="mt-2 text-red-600 text-sm font-semibold">Required fields missing</div>
                            )}
                            <button 
                                type="button" 
                                onClick={() => setPlaces(places.filter((_, i) => i !== idx))} 
                                className="absolute top-4 right-4 px-3 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-red-700 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-8">
                {/* SERVICES */}
                <h3 className="text-3xl font-bold mb-4 text-emerald-900">Travel Services</h3>
                <p className="text-emerald-700 mb-6">Add hotels, restaurants, and other services for your trip</p>
                <button 
                    type="button" 
                    onClick={handleAddService} 
                    className="mb-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-colors"
                >
                    Add Service
                </button>
                <div className="space-y-6">
                    {services.map((svc, idx) => (
                        <div key={idx} className="relative">
                            <TravelPlanServicesForm
                                initialData={svc}
                                onChange={data => {
                                    const updated = [...services];
                                    updated[idx] = data;
                                    setServices(updated);
                                }}
                                formError={formErrors.services[idx]}
                            />
                            {formErrors.services[idx] && (
                                <div className="mt-2 text-red-600 text-sm font-semibold">Required fields missing</div>
                            )}
                            <button 
                                type="button" 
                                onClick={() => setServices(services.filter((_, i) => i !== idx))} 
                                className="absolute top-4 right-4 px-3 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-red-700 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-8">
                {/* PARTICIPANTS */}
                <h3 className="text-3xl font-bold mb-4 text-emerald-900">Travel Companions</h3>
                <p className="text-emerald-700 mb-6">Invite friends and family to join your trip</p>
                <button 
                    type="button" 
                    onClick={handleAddParticipant} 
                    className="mb-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-colors"
                >
                    Add Team Member
                </button>
                <div className="space-y-6">
                    {participants.map((p, idx) => (
                        <div key={idx} className="relative">
                            <TravelPlanParticipantsForm
                                initialData={p}
                                onChange={data => {
                                    const updated = [...participants];
                                    updated[idx] = data;
                                    setParticipants(updated);
                                }}
                                formError={formErrors.participants[idx]}
                            />
                            {formErrors.participants[idx] && (
                                <div className="mt-2 text-red-600 text-sm font-semibold">Required fields missing</div>
                            )}
                            <button 
                                type="button" 
                                onClick={() => setParticipants(participants.filter((_, i) => i !== idx))} 
                                className="absolute top-4 right-4 px-3 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-red-700 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-8">
                {/* COMMENTS */}
                <h3 className="text-3xl font-bold mb-4 text-emerald-900">Notes & Ideas</h3>
                <p className="text-emerald-700 mb-6">Add any thoughts or planning notes for your trip</p>
                <button 
                    type="button" 
                    onClick={handleAddComment} 
                    className="mb-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-colors"
                >
                    Add Comment
                </button>
                <div className="space-y-6">
                    {comments.map((c, idx) => (
                        <div key={idx} className="relative">
                            <TravelPlanCommentsForm
                                initialData={c}
                                onChange={data => {
                                    const updated = [...comments];
                                    updated[idx] = data;
                                    setComments(updated);
                                }}
                                formError={formErrors.comments[idx]}
                            />
                            {formErrors.comments[idx] && (
                                <div className="mt-2 text-red-600 text-sm font-semibold">Required fields missing</div>
                            )}
                            <button 
                                type="button" 
                                onClick={() => setComments(comments.filter((_, i) => i !== idx))} 
                                className="absolute top-4 right-4 px-3 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-red-700 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {createdPlan && (
                <div className="bg-green-50 border-2 border-green-200 shadow-lg rounded-xl p-8 text-center">
                    <div className="text-green-700 text-2xl font-bold mb-2">Travel Plan Created Successfully!</div>
                    <div className="text-green-600">Your travel plan is ready. Time to make it happen!</div>
                </div>
            )}
        </div>
    );
};

export default TravelPlanCreateForm;
