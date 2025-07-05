import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { getTravelPlanById, getPlanParticipants, getPlanComments, getPlannedPlaces, getPlanServices, addPlanComment } from '../../services/travelPlan.service';
import { getUser } from '../../services/user.service';
import { getPlaceById } from '../../services/place.service';
import { getServiceById } from '../../services/service.service';
import ServiceCard from '../../components/service/ServiceCard';
import PlaceCard from '../../components/place/PlaceCard';
import type { TravelPlan, PlanParticipant, PlanComment } from '../../types/travelPlan.type';
import type { PlaceDto } from '../../types/place.type';
import type { ServiceResponseDto } from '../../types/service.type';
import type { User } from '../../types/user.type';

const TravelPlanDetails: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const { user } = useAuth();
    const [plan, setPlan] = useState<TravelPlan | null>(null);
    const [participants, setParticipants] = useState<PlanParticipant[]>([]);

    const [isOwner, setIsOwner] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const canComment = isOwner || isEditor;

    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

    const handleNavigateToEdit = () => {
        if (!planId) return;
        window.location.href = `/travelplan/${planId}/edit`;
    };

    const handleAddComment = async () => {
        if (!planId || !commentContent.trim()) return;
        setCommentLoading(true);
        try {
            const newComment = await addPlanComment(planId, { content: commentContent });
            setComments(prev => [
                { ...newComment, user: user || null },
                ...prev
            ]);
            setCommentContent('');
            setShowCommentForm(false);
        } catch (err) {
            alert('Failed to add comment.');
        } finally {
            setCommentLoading(false);
        }
    };

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

                if (user) {
                    const userIdNum = typeof user.user_id === 'string' ? parseInt(user.user_id, 10) : user.user_id;
                    setIsOwner(rawParticipants.some(p => Number(p.user_id) === userIdNum && p.role_permission === 'Owner'));
                    setIsEditor(rawParticipants.some(p => Number(p.user_id) === userIdNum && p.role_permission === 'Editor'));
                } else {
                    setIsOwner(false);
                    setIsEditor(false);
                }

                setParticipants(rawParticipants);

                const commentsWithUser = await Promise.all(
                    rawComments.map(async c => {
                        try {
                            const userObj = await getUser(c.user_id);
                            return { ...c, user: userObj };
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
    }, [planId, user]);

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
    
    if (!plan) return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center text-gray-600 text-lg">Travel plan not found.</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-xl p-8 mb-10">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-5xl font-bold text-blue-900 mb-4">{plan.name}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                    Status: {plan.status || 'Draft'}
                                </span>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                                    Start: {plan.start_date || 'TBD'}
                                </span>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                                    End: {plan.end_date || 'TBD'}
                                </span>
                            </div>
                        </div>
                        {isOwner && (
                            <button 
                                onClick={handleNavigateToEdit} 
                                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all"
                            >
                                Edit Plan
                            </button>
                        )}
                    </div>
                </div>

                {/* Participants Section */}
                <div className="bg-white border-2 border-gray-100 shadow-lg rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-blue-800 mb-6">Participants</h2>
                    {participants.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No participants added yet</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {participants.map((p, idx) => (
                                <div key={idx} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-semibold text-blue-700">User {p.user_id}</span>
                                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                {p.role_permission}
                                            </span>
                                        </div>
                                        <div className="text-sm">
                                            {p.is_going ? (
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                                                    Going
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                    Not Going
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Places Section */}
                <div className="bg-white border-2 border-emerald-100 shadow-lg rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-emerald-800 mb-6">Places to Visit</h2>
                    {places.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No places added yet</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {places.map(place => (
                                <div key={place.place_id} className="border-2 border-emerald-200 rounded-lg p-4 hover:border-emerald-300 transition-all">
                                    <PlaceCard place={place} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Services Section */}
                <div className="bg-white border-2 border-blue-100 shadow-lg rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-blue-800 mb-6">Services & Bookings</h2>
                    {services.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No services added yet</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services.map(service => (
                                <div key={service.service_id} className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                                    <ServiceCard service={service} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <div className="bg-white border-2 border-gray-100 shadow-lg rounded-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Comments & Notes</h2>
                        {canComment && (
                            <button 
                                onClick={() => setShowCommentForm(v => !v)} 
                                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 transition-all"
                            >
                                {showCommentForm ? 'Cancel' : 'Add Comment'}
                            </button>
                        )}
                    </div>
                    
                    {showCommentForm && (
                        <form onSubmit={e => { e.preventDefault(); handleAddComment(); }} className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={commentContent}
                                    onChange={e => setCommentContent(e.target.value)}
                                    className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                    placeholder="Write your comment..."
                                    disabled={commentLoading}
                                />
                                <button 
                                    type="submit" 
                                    className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
                                    disabled={commentLoading || !commentContent.trim()}
                                >
                                    {commentLoading ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                        </form>
                    )}
                    
                    {comments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No comments yet</div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map(c => (
                                <div key={c.comment_id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <span className="font-semibold text-blue-700">
                                                {c.user?.username || `User ${c.user_id}`}
                                            </span>
                                            <p className="text-gray-700 mt-1">{c.content}</p>
                                        </div>
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

export default TravelPlanDetails;
