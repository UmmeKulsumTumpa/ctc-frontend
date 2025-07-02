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
    onLike?: () => void;
    viewLabel?: string;
    showViewButton?: boolean;
}

const BlogDetailCard: React.FC<BlogDetailCardProps> = ({ post, services, images, userId, onView, onEdit, onDelete, onLike, viewLabel = "View", showViewButton = true }) => {
    const isOwner = userId && userId === post.user_id;
    return (
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-2xl p-8 border border-blue-200 max-w-3xl mx-auto flex flex-col gap-8 font-sans">
            <div className="flex flex-col gap-2 mb-2 relative">
                <div className="flex justify-center items-center mb-2">
                    <svg className="w-7 h-7" fill="#e53935" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="text-lg font-bold text-red-700 ml-2">{post.likes}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 font-serif drop-shadow-lg tracking-tight w-full text-center md:text-left">{post.title}</h2>
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded shadow font-mono whitespace-nowrap border border-green-200 md:ml-auto">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-green-700 mb-2">
                {post.categories?.map((cat) => (
                    <span key={cat} className="bg-gradient-to-r from-green-100 to-blue-100 px-3 py-1 rounded-full font-semibold shadow-sm border border-green-200 text-green-800">{cat}</span>
                ))}
            </div>
            <div className="text-blue-900 mb-2 text-lg md:text-xl font-light italic">{post.description}</div>
            <div className="flex flex-wrap gap-4 text-base text-blue-900 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-4 shadow-inner items-center border border-blue-200">
                <span><span className="font-semibold">Effort:</span> {post.effort_level || 'N/A'}</span>
                <span><span className="font-semibold">Cost:</span> {post.total_cost ?? 'N/A'}</span>
                <span><span className="font-semibold">Duration:</span> {post.total_duration ?? 'N/A'}</span>
                <span><span className="font-semibold">Visibility:</span> {post.visibility}</span>
            </div>
            {images && images.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2 text-blue-700 text-lg">Images</h4>
                    <div className="flex flex-wrap gap-6">
                        {images.map((img) => (
                            <div key={img.url} className="relative flex flex-col items-center">
                                <img src={img.url} alt={img.caption || ''} className="h-44 w-44 object-cover rounded-xl border-2 border-blue-200 shadow-lg" />
                                {img.caption && <div className="text-xs text-center mt-2 text-blue-900 bg-blue-50 rounded px-2 py-1 border border-blue-100">{img.caption}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {services && services.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2 text-green-700 text-lg">Services</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((svc) => (
                            <div key={svc.post_service_id} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-5 border border-green-200 flex flex-col gap-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-green-800 text-lg">{svc.service_id}</span>
                                    {svc.recommended && <span className="ml-2 px-2 py-0.5 text-xs bg-green-200 text-green-800 rounded-full border border-green-300">Recommended</span>}
                                </div>
                                {svc.cost && <div className="text-sm text-green-900">Cost: <span className="font-semibold">{svc.cost}</span></div>}
                                {svc.rating && <div className="text-sm text-blue-700">Rating: <span className="font-semibold">{svc.rating}</span></div>}
                                {svc.visit_date && <div className="text-sm text-blue-900">Date: {svc.visit_date}</div>}
                                {svc.notes && <div className="text-sm text-blue-900 italic">Notes: {svc.notes}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex flex-wrap gap-3 mt-8 justify-between items-center">
                <div className="flex items-center gap-2">
                    {onLike && (
                        <button onClick={onLike} title="Like this post" className="px-2 py-1 rounded-full bg-white border-2 border-red-700 shadow text-xl hover:bg-red-50 hover:scale-110 active:scale-95 transition-all flex items-center" style={{ color: '#b71c1c' }}>
                            <svg className="w-7 h-7" fill="#b71c1c" viewBox="0 0 24 24">
                                <path d="M9 22h-3c-1.1 0-2-.9-2-2v-7c0-1.1.9-2 2-2h3v11zm11-11c0-1.1-.9-2-2-2h-5.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06l-1-1c-.37-.36-.89-.54-1.41-.46-.52.08-.97.44-1.13.95l-3.24 9.65c-.09.28-.14.57-.14.87v7c0 1.1.9 2 2 2h8c.82 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1c0-1.1-.9-2-2-2z" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    {showViewButton && (
                        <button onClick={onView} className="px-5 py-2 rounded-lg bg-blue-500 text-white text-sm font-bold shadow hover:bg-blue-600 transition-all">{viewLabel}</button>
                    )}
                    {isOwner && (
                        <>
                            <button onClick={onEdit} className="px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-bold shadow hover:bg-green-700 transition-all">Edit</button>
                            <button onClick={onDelete} className="px-5 py-2 rounded-lg bg-red-400 text-white text-sm font-bold shadow hover:bg-red-500 transition-all">Delete</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetailCard;
