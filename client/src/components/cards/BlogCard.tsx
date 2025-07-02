import type { BlogPost } from "../../types/blog.type";

interface BlogCardProps {
    post: BlogPost;
    userId?: string | null; // logged in user id, if any
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, userId, onView, onEdit, onDelete }) => {
    const isOwner = userId && userId === post.user_id;
    return (
        <div className="bg-gray-100 hover:bg-gray-200 rounded-xl shadow-lg p-8 border border-gray-200 flex flex-col gap-2 transition-transform hover:scale-[1.02] cursor-pointer font-sans min-h-[260px] max-w-xl mx-auto h-full">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-2xl font-bold text-gray-800 truncate font-serif drop-shadow-sm">{post.title}</h3>
                <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded shadow font-mono ml-2 whitespace-nowrap">{new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-pink-600 mb-1">
                {post.categories?.map((cat) => (
                    <span key={cat} className="bg-pink-100 px-2 py-0.5 rounded-full font-semibold shadow-sm">{cat}</span>
                ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1">
                    <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                    <span className="font-semibold text-pink-700">{post.likes}</span>
                </span>
            </div>
            <div className="flex gap-2 mt-3 mt-auto">
                <button onClick={onView} className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold shadow hover:bg-blue-600 transition">View</button>
                {isOwner && (
                    <>
                        <button onClick={onEdit} className="px-3 py-1 rounded bg-yellow-400 text-white text-xs font-semibold shadow hover:bg-yellow-500 transition">Edit</button>
                        <button onClick={onDelete} className="px-3 py-1 rounded bg-red-500 text-white text-xs font-semibold shadow hover:bg-red-600 transition">Delete</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogCard;
