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

    if (loading) return <div className="text-center mt-10">Loading blogs...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 min-h-[80vh] px-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-center flex-1">Travel Blogs</h2>
                <button
                    onClick={() => navigate(PATHS.BLOG_CREATE)}
                    className="ml-4 px-4 py-2 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
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