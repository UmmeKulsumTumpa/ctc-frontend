import React from "react";
import type { BlogPost } from "../../types/blog.type";
import type { BlogService } from "../../types/blog.service.type";
import type { BlogImage } from "../../types/blog.image.type";

interface BlogDetailCardProps {
    post: BlogPost;
    services?: BlogService[];
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
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {images.map((img) => (
                            <img key={img.url} src={img.url} alt={img.caption || ''} className="h-40 rounded-lg object-cover border shadow" />
                        ))}
                    </div>
                </div>
            )}
            {services && services.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2 text-blue-700">Services</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        {services.map((svc) => (
                            <li key={svc.service_id} className="text-gray-700">
                                <span className="font-medium text-blue-700">{svc.name}</span> - {svc.type} {svc.address && <span className="text-gray-500">@ {svc.address}</span>}
                            </li>
                        ))}
                    </ul>
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
