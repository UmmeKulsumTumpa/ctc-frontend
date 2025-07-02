import React from "react";
import type { BlogPost } from "../../types/blog.type";

import type { BlogPostService } from "../../types/blog.postservice.type";
import type { BlogImage } from "../../types/blog.image.type";

interface BlogDetailCardProps {
    post: BlogPost;
    services?: BlogPostService[];
    images?: BlogImage[];
    userId?: string | null;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    viewLabel?: string;
    showViewButton?: boolean;
}

const BlogDetailCard: React.FC<BlogDetailCardProps> = ({ post, services, images, userId, onView, onEdit, onDelete, viewLabel = "View", showViewButton = true }) => {
    const isOwner = userId && userId === post.user_id;
    return (
        <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 border border-gray-100 max-w-2xl mx-auto flex flex-col gap-6 font-sans">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-extrabold text-blue-700 font-serif drop-shadow-sm">{post.title}</h2>
                <span className="text-xs text-gray-400 font-mono">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-pink-600 mb-2">
                {post.categories?.map((cat) => (
                    <span key={cat} className="bg-pink-100 px-2 py-0.5 rounded-full font-semibold shadow-sm">{cat}</span>
                ))}
            </div>
            <div className="text-gray-700 mb-2 text-lg font-light italic">{post.description}</div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 bg-white/60 rounded p-3 shadow-inner">
                <span><span className="font-semibold">Effort:</span> {post.effort_level || 'N/A'}</span>
                <span><span className="font-semibold">Cost:</span> {post.total_cost ?? 'N/A'}</span>
                <span><span className="font-semibold">Duration:</span> {post.total_duration ?? 'N/A'}</span>
                <span><span className="font-semibold">Likes:</span> {post.likes}</span>
                <span><span className="font-semibold">Visibility:</span> {post.visibility}</span>
            </div>
            {images && images.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2 text-pink-700">Images</h4>
                    <div className="flex flex-wrap gap-4">
                        {images.map((img) => (
                            <div key={img.url} className="relative flex flex-col items-center">
                                <img src={img.url} alt={img.caption || ''} className="h-40 w-40 object-cover rounded-lg border shadow" />
                                {img.caption && <div className="text-xs text-center mt-1 text-gray-700">{img.caption}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {services && services.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2 text-blue-700">Services</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((svc) => (
                            <div key={svc.post_service_id} className="bg-white rounded-lg shadow p-4 border flex flex-col gap-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-blue-700 text-lg">{svc.service_id}</span>
                                    {svc.recommended && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Recommended</span>}
                                </div>
                                {svc.cost && <div className="text-sm text-gray-600">Cost: <span className="font-semibold">{svc.cost}</span></div>}
                                {svc.rating && <div className="text-sm text-yellow-600">Rating: <span className="font-semibold">{svc.rating}</span></div>}
                                {svc.visit_date && <div className="text-sm text-gray-500">Date: {svc.visit_date}</div>}
                                {svc.notes && <div className="text-sm text-gray-500 italic">Notes: {svc.notes}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex gap-2 mt-4">
                {showViewButton && (
                    <button onClick={onView} className="px-4 py-2 rounded bg-blue-500 text-white text-xs font-semibold shadow hover:bg-blue-600 transition">{viewLabel}</button>
                )}
                {isOwner && (
                    <>
                        <button onClick={onEdit} className="px-4 py-2 rounded bg-yellow-400 text-white text-xs font-semibold shadow hover:bg-yellow-500 transition">Edit</button>
                        <button onClick={onDelete} className="px-4 py-2 rounded bg-red-500 text-white text-xs font-semibold shadow hover:bg-red-600 transition">Delete</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogDetailCard;
