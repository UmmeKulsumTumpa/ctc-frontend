import React, { useEffect, useState } from "react";
import type { BlogPost } from "../../types/blog/blog.type";
import type { BlogPostService } from "../../types/blog/blog.postservice.type";
import type { BlogImage } from "../../types/blog/blog.image.type";
import ServiceDetailsCard from "../service/ServiceDetailsCard";
import { getServiceById } from "../../services/service.service";
import PlaceCard from "../place/PlaceCard";

interface BlogDetailCardProps {
    post: BlogPost;
    services?: BlogPostService[];
    images?: BlogImage[];
    userId?: string | null;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onLike?: () => void;
    viewLabel?: string;
    showViewButton?: boolean;
}

const BlogDetailCard: React.FC<BlogDetailCardProps> = ({ post, services, images, userId, onView, onEdit, onDelete, onLike, viewLabel = "View", showViewButton = true }) => {
    const isOwner = userId && userId === post.user_id;
    const [serviceDetails, setServiceDetails] = useState<Record<string, any>>({});

    useEffect(() => {
        if (!services) return;
        const fetchAll = async () => {
            const details: Record<string, any> = {};
            await Promise.all(
                services.map(async (svc) => {
                    try {
                        details[svc.service_id] = await getServiceById(svc.service_id);
                    } catch {
                        details[svc.service_id] = null;
                    }
                })
            );
            setServiceDetails(details);
        };
        fetchAll();
    }, [services]);

    // Place details rendering (if any)
    // If post.place_id is available, fetch the place details by id
    const [place, setPlace] = useState<any>(null);
    useEffect(() => {
        if (post.place_id) {
            import('../../services/place.service').then(({ getPlaceById }) => {
                getPlaceById(post.place_id!).then(setPlace).catch(() => setPlace(null));
            });
        } else {
            setPlace(null);
        }
    }, [post.place_id]);

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-blue-200 max-w-5xl mx-auto flex flex-col gap-8">

            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">{post.title}</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-full shadow-sm border border-emerald-200">
                            {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span className="text-lg font-bold text-red-600">{post.likes || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.categories.map((cat) => (
                            <span key={cat} className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold border border-emerald-300">
                                {cat}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 text-center">
                    <div className="text-blue-600 text-sm font-medium mb-1">Difficulty</div>
                    <div className="text-blue-900 font-bold text-lg">{post.effort_level || 'Not specified'}</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center">
                    <div className="text-emerald-600 text-sm font-medium mb-1">Total Cost</div>
                    <div className="text-emerald-900 font-bold text-lg">{post.total_cost ? `$${post.total_cost}` : 'Not specified'}</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 text-center">
                    <div className="text-blue-600 text-sm font-medium mb-1">Duration</div>
                    <div className="text-blue-900 font-bold text-lg">{post.total_duration ? `${post.total_duration} days` : 'Not specified'}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-center">
                    <div className="text-gray-600 text-sm font-medium mb-1">Visibility</div>
                    <div className="text-gray-900 font-bold text-lg">{post.visibility}</div>
                </div>
            </div>

            {/* Place Information */}
            {place && (
                <div className="bg-blue-50 rounded-3xl p-6 border border-blue-200">
                    <h4 className="font-bold mb-4 text-sky-900 text-xl">Destination</h4>
                    <PlaceCard place={place} />
                </div>
            )}

            {/* Description */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6">
                <h4 className="font-bold mb-4 text-blue-900 text-xl">Travel Story</h4>
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{post.description}</div>
            </div>

            {/* Images Section */}
            {images && images.length > 0 && (
                <div className="bg-blue-50 rounded-3xl p-6 border border-blue-200">
                    <h4 className="font-bold mb-6 text-blue-900 text-xl">📸 Travel Photos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((img) => (
                            <div key={img.url} className="bg-white rounded-2xl p-4 shadow-lg border border-blue-100">
                                <img
                                    src={img.url}
                                    alt={img.caption || 'Travel photo'}
                                    className="w-full h-48 object-cover rounded-xl border border-blue-200"
                                />
                                {img.caption && (
                                    <div className="mt-3 text-sm text-center text-blue-900 bg-blue-100 rounded-xl px-3 py-2 border border-blue-200 font-medium">
                                        {img.caption}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Services Section */}
            {services && services.length > 0 && (
                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200">
                    <h4 className="font-bold mb-6 text-emerald-900 text-xl">Services & Experiences</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {services.map((svc) => (
                            <div key={svc.post_service_id} className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                                {serviceDetails[svc.service_id] ? (
                                    <ServiceDetailsCard service={serviceDetails[svc.service_id]} />
                                ) : (
                                    <div className="font-bold text-emerald-900 text-lg mb-3">Service: {svc.service_id}</div>
                                )}

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    {svc.cost && (
                                        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                                            <div className="text-emerald-600 text-sm font-medium">Cost</div>
                                            <div className="text-emerald-900 font-bold">${svc.cost}</div>
                                        </div>
                                    )}
                                    {svc.rating && (
                                        <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                                            <div className="text-blue-600 text-sm font-medium">Rating</div>
                                            <div className="text-blue-900 font-bold">{svc.rating}/5 ⭐</div>
                                        </div>
                                    )}
                                    {svc.visit_date && (
                                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 col-span-2">
                                            <div className="text-gray-600 text-sm font-medium">Visit Date</div>
                                            <div className="text-gray-900 font-bold">{new Date(svc.visit_date).toLocaleDateString()}</div>
                                        </div>
                                    )}
                                </div>

                                {svc.recommended && (
                                    <div className="mt-3 text-center">
                                        <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold border border-emerald-300">
                                            ✅ Highly Recommended
                                        </span>
                                    </div>
                                )}

                                {svc.notes && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="text-gray-600 text-sm font-medium mb-1">Notes</div>
                                        <div className="text-gray-900 italic">{svc.notes}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-between items-center pt-6 border-t-2 border-blue-100">
                <div className="flex items-center gap-3">
                    {onLike && (
                        <button
                            onClick={onLike}
                            title="Like this travel story"
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span className="font-bold">Love This Story</span>
                        </button>
                    )}
                </div>

                <div className="flex gap-3">
                    {showViewButton && (
                        <button
                            onClick={onView}
                            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            {viewLabel}
                        </button>
                    )}
                    {isOwner && (
                        <>
                            <button
                                onClick={onEdit}
                                className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-colors"
                            >
                                Edit Story
                            </button>
                            <button
                                onClick={onDelete}
                                className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg hover:bg-red-600 transition-colors"
                            >
                                Delete Story
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetailCard;
