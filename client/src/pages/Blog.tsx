import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBlogs, deleteBlog } from "../services/blog.service";
import type { BlogPost } from "../types/blog.type";
import BlogList from "../components/cards/BlogList";
import { useAuth } from "../contexts/AuthContext";
import { PATHS } from "../constants/path.constants";

const Blog = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const userId = user?.user_id?.toString() ?? null;
    const navigate = useNavigate();

    const handleView = (blog: BlogPost) => {
        navigate(PATHS.BLOG_DETAIL.replace(':id', blog.post_id));
    };
    const handleEdit = (blog: BlogPost) => {
        navigate(PATHS.BLOG_EDIT.replace(':id', blog.post_id));
    };
    const handleDelete = async (blog: BlogPost) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await deleteBlog(blog.post_id);
                setBlogs((prev) => prev.filter((b) => b.post_id !== blog.post_id));
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Failed to delete blog.');
            }
        }
    };

    useEffect(() => {
        getAllBlogs()
            .then(setBlogs)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center mt-16 text-blue-600 text-xl font-bold animate-pulse">Loading blogs...</div>;
    if (error) return <div className="text-center mt-16 text-red-500 text-lg font-semibold">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto py-12 min-h-[80vh] px-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-extrabold text-blue-800 font-serif tracking-tight drop-shadow-sm">Travel Blogs</h2>
                <button
                    onClick={() => navigate(PATHS.BLOG_CREATE)}
                    className="ml-4 px-6 py-2 rounded-lg bg-[#1a237e] text-white font-bold shadow-lg hover:bg-blue-900 transition-all text-base"
                >
                    + Create Blog
                </button>
            </div>
            <BlogList
                blogs={blogs}
                userId={userId}
                onBlogClick={handleView}
                onEditBlog={handleEdit}
                onDeleteBlog={handleDelete}
            />
        </div>
    );
};

export default Blog;