import React, { useState } from 'react';
import TravelPlanForm from './TravelPlanForm';
import TravelPlanPlacesForm from './TravelPlanPlacesForm';
import TravelPlanServicesForm from './TravelPlanServicesForm';
import TravelPlanParticipantsForm from './TravelPlanParticipantsForm';
import TravelPlanCommentsForm from './TravelPlanCommentsForm';
import { submitTravelPlanWithSubResources } from './travelPlanSubmitHelper';
import { cleanPayload } from '../../utils/payload';
import type { TravelPlan, CreateTravelPlanRequestDto } from '../../types/travelPlan.type';

const TravelPlanCreateForm: React.FC<{ onCreated?: (plan: TravelPlan) => void }> = ({ onCreated }) => {
    
    const [places, setPlaces] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [participants, setParticipants] = useState<any[]>([]);
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
            if (created && onCreated) onCreated(created);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create travel plan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800 font-serif tracking-tight drop-shadow-lg">Create New Travel Plan</h2>

            {error && <div className="text-red-500 mb-3 text-center text-lg font-semibold">{error}</div>}
            {detailedError && <div className="text-red-400 mb-3 text-center text-xs">{detailedError}</div>}

            <TravelPlanForm onSubmit={handleSubmit} submitLabel={loading ? "Creating..." : "Create"} />


            <div className="mt-10">
                {/* PLACES */}
                <h3 className="text-xl font-bold mb-3 text-blue-800">Places <span className="text-xs text-blue-400">(optional)</span></h3>
                <button type="button" onClick={handleAddPlace} className="mb-3 px-4 py-2 bg-green-50 border border-green-700 text-green-900 rounded-lg font-bold shadow hover:bg-green-200 transition">Add Place</button>
                <ul className="space-y-4 mt-2">
                    {places.map((place, idx) => (
                        <li key={idx} className="flex flex-col gap-2 border-b border-green-100 pb-3">
                            <TravelPlanPlacesForm
                                initialData={place}
                                onChange={data => {
                                    const updated = [...places];
                                    updated[idx] = data;
                                    setPlaces(updated);
                                }}
                                formError={formErrors.places[idx]}
                            />
                            {formErrors.places[idx] && <span className="text-xs text-red-500">Required fields missing</span>}
                            <button type="button" onClick={() => setPlaces(places.filter((_, i) => i !== idx))} className="self-end px-3 py-1 text-xs bg-red-400 text-white rounded-lg shadow hover:bg-red-500 transition">Remove</button>
                        </li>
                    ))}
                </ul>

                {/* SERVICES */}
                <h3 className="text-xl font-bold mb-3 mt-10 text-blue-800">Services <span className="text-xs text-blue-400">(optional)</span></h3>
                <button type="button" onClick={handleAddService} className="mb-3 px-4 py-2 bg-yellow-50 border border-yellow-700 text-yellow-900 rounded-lg font-bold shadow hover:bg-yellow-200 transition">Add Service</button>
                <ul className="space-y-4 mt-2">
                    {services.map((svc, idx) => (
                        <li key={idx} className="flex flex-col gap-2 border-b border-yellow-100 pb-3">
                            <TravelPlanServicesForm
                                initialData={svc}
                                onChange={data => {
                                    const updated = [...services];
                                    updated[idx] = data;
                                    setServices(updated);
                                }}
                                formError={formErrors.services[idx]}
                            />
                            {formErrors.services[idx] && <span className="text-xs text-red-500">Required fields missing</span>}
                            <button type="button" onClick={() => setServices(services.filter((_, i) => i !== idx))} className="self-end px-3 py-1 text-xs bg-red-400 text-white rounded-lg shadow hover:bg-red-500 transition">Remove</button>
                        </li>
                    ))}
                </ul>

                {/* PARTICIPANTS */}
                <h3 className="text-xl font-bold mb-3 mt-10 text-blue-800">Participants <span className="text-xs text-blue-400">(optional)</span></h3>
                <button type="button" onClick={handleAddParticipant} className="mb-3 px-4 py-2 bg-purple-50 border border-purple-700 text-purple-900 rounded-lg font-bold shadow hover:bg-purple-200 transition">Add Participant</button>
                <ul className="space-y-4 mt-2">
                    {participants.map((p, idx) => (
                        <li key={idx} className="flex flex-col gap-2 border-b border-purple-100 pb-3">
                            <TravelPlanParticipantsForm
                                initialData={p}
                                onChange={data => {
                                    const updated = [...participants];
                                    updated[idx] = data;
                                    setParticipants(updated);
                                }}
                                formError={formErrors.participants[idx]}
                            />
                            {formErrors.participants[idx] && <span className="text-xs text-red-500">Required fields missing</span>}
                            <button type="button" onClick={() => setParticipants(participants.filter((_, i) => i !== idx))} className="self-end px-3 py-1 text-xs bg-red-400 text-white rounded-lg shadow hover:bg-red-500 transition">Remove</button>
                        </li>
                    ))}
                </ul>

                {/* COMMENTS */}
                <h3 className="text-xl font-bold mb-3 mt-10 text-blue-800">Comments <span className="text-xs text-blue-400">(optional)</span></h3>
                <button type="button" onClick={handleAddComment} className="mb-3 px-4 py-2 bg-blue-50 border border-blue-700 text-blue-900 rounded-lg font-bold shadow hover:bg-blue-200 transition">Add Comment</button>
                <ul className="space-y-4 mt-2">
                    {comments.map((c, idx) => (
                        <li key={idx} className="flex flex-col gap-2 border-b border-blue-100 pb-3">
                            <TravelPlanCommentsForm
                                initialData={c}
                                onChange={data => {
                                    const updated = [...comments];
                                    updated[idx] = data;
                                    setComments(updated);
                                }}
                                formError={formErrors.comments[idx]}
                            />
                            {formErrors.comments[idx] && <span className="text-xs text-red-500">Required fields missing</span>}
                            <button type="button" onClick={() => setComments(comments.filter((_, i) => i !== idx))} className="self-end px-3 py-1 text-xs bg-red-400 text-white rounded-lg shadow hover:bg-red-500 transition">Remove</button>
                        </li>
                    ))}
                </ul>
            </div>

            {createdPlan && (
                <div className="mt-6 text-green-700 font-semibold">Travel plan created successfully!</div>
            )}
        </div>
    );
};

export default TravelPlanCreateForm;
