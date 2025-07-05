import type { BlogPost } from "../../types/blog/blog.type";

interface BlogCardProps {
    post: BlogPost;
    userId?: string | null;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, userId, onView, onEdit, onDelete }) => {
    const isOwner = userId && userId === post.user_id;
    return (
        <div className="bg-white hover:bg-sky-50 rounded-3xl shadow-lg p-8 border-2 border-sky-200 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer min-h-[300px] max-w-2xl w-full h-full group">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-sky-900 leading-tight flex-1 mr-4">{post.title}</h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full shadow-sm border border-emerald-200 whitespace-nowrap">
                    {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
            </div>

            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((cat) => (
                        <span key={cat} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
                            {cat}
                        </span>
                    ))}
                </div>
            )}

            {/* Description Preview */}
            {post.description && (
                <div className="flex-1 mb-4">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {post.description.length > 150 ? `${post.description.substring(0, 150)}...` : post.description}
                    </p>
                </div>
            )}

            {/* Stats and Actions */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-sky-100">
                <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                        <span className="font-bold text-red-600">{post.likes || 0}</span>
                    </div>
                    {post.total_cost && (
                        <div className="text-emerald-600 text-sm font-semibold">
                            ${post.total_cost}
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onView}
                        className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg hover:bg-blue-700 transition-colors"
                    >
                        Read Story
                    </button>
                    {isOwner && (
                        <>
                            <button
                                onClick={onEdit}
                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-lg hover:bg-emerald-700 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={onDelete}
                                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-bold shadow-lg hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
