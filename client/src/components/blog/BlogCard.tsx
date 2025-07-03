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
        <div className="bg-white hover:bg-blue-50 rounded-2xl shadow-xl p-8 border border-blue-200 flex flex-col gap-3 transition-transform hover:scale-[1.03] cursor-pointer font-sans min-h-[260px] max-w-xl w-full h-full">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-extrabold text-blue-800 truncate font-serif drop-shadow-sm tracking-tight">{post.title}</h3>
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded shadow font-mono ml-2 whitespace-nowrap">{new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-green-700 mb-1">
                {post.categories?.map((cat) => (
                    <span key={cat} className="bg-green-100 px-2 py-0.5 rounded-full font-semibold shadow-sm">{cat}</span>
                ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-900">
                <span className="inline-flex items-center gap-1">
                    <svg className="w-5 h-5" fill="#b71c1c" viewBox="0 0 20 20">
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                    <span className="font-semibold text-red-700">{post.likes}</span>
                </span>
            </div>
            <div className="flex gap-2 mt-4 mt-auto justify-end">
                <button onClick={onView} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition-colors">View</button>
                {isOwner && (
                    <>
                        <button onClick={onEdit} className="px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold shadow hover:bg-green-700 transition-colors">Edit</button>
                        <button onClick={onDelete} className="px-4 py-2 rounded-lg bg-red-400 text-white text-xs font-semibold shadow hover:bg-red-500 transition-colors">Delete</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogCard;
