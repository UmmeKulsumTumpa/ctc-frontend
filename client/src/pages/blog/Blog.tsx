import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBlogs, deleteBlog } from "../../services/blog/blog.service";
import type { BlogPost } from "../../types/blog/blog.type";
import BlogList from "../../components/blog/BlogList";
import { useAuth } from "../../contexts/AuthContext";
import { PATHS } from "../../constants/path.constants";

const Blog = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<{ categories?: string[]; visibility?: string }>({});
    const [categoryInput, setCategoryInput] = useState('');
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

    const fetchBlogs = () => {
        setLoading(true);
        setError(null);
        getAllBlogs(filters)
            .then(setBlogs)
            .catch((err) => {
                if (err?.message?.includes('Network')) {
                    setError('Cannot connect to server. Please check your connection and try again.');
                } else {
                    setError(err?.message || 'Failed to load blogs.');
                }
            })
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        fetchBlogs();
    }, [filters]);

    if (loading) return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center text-emerald-600 text-2xl font-bold animate-pulse">
                    Loading travel stories...
                </div>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-5xl font-bold text-emerald-900 mb-2">Travel Stories</h2>
                            <p className="text-xl text-gray-600">Share your adventures with fellow travelers</p>
                        </div>
                        <button
                            onClick={() => navigate(PATHS.BLOG_CREATE)}
                            className="px-8 py-4 rounded-2xl bg-emerald-600 text-white text-lg font-bold border-4 border-emerald-700 shadow-lg hover:bg-emerald-700 hover:border-emerald-800 transform hover:scale-105 transition-all duration-300"
                        >
                            Write Your Story
                        </button>
                    </div>
                </div>
                <div className="text-center text-red-500 text-lg font-semibold mb-8">
                    {error}
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={fetchBlogs}
                        className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-5xl font-bold text-emerald-900 mb-2">Travel Stories</h2>
                            <p className="text-xl text-gray-600">Share your adventures with fellow travelers</p>
                        </div>
                        <button
                            onClick={() => navigate(PATHS.BLOG_CREATE)}
                            className="px-8 py-4 rounded-2xl bg-emerald-600 text-white text-lg font-bold border-4 border-emerald-700 shadow-lg hover:bg-emerald-700 hover:border-emerald-800 transform hover:scale-105 transition-all duration-300"
                        >
                            Write Your Story
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white border-2 border-sky-200 shadow-lg rounded-2xl p-6 mb-10">
                    <h3 className="text-xl font-bold text-sky-900 mb-4 text-center">Find Stories by Categories</h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <input
                            className="border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none shadow-sm"
                            placeholder="Like 'Forest' or 'Mountain'..."
                            value={categoryInput}
                            onChange={e => setCategoryInput(e.target.value)}
                        />
                        
                        <button
                            className="px-6 py-3 rounded-xl bg-sky-600 text-white font-bold border-2 border-sky-700 shadow-sm hover:bg-sky-700 transition-all"
                            onClick={() => setFilters(f => ({ ...f, categories: categoryInput ? [categoryInput] : undefined }))}
                        >
                            Search Stories
                        </button>
                        <button
                            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-bold border-2 border-gray-300 shadow-sm hover:bg-gray-300 transition-all"
                            onClick={() => { setFilters({}); setCategoryInput(''); }}
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Blog List Container - No border since BlogCard has its own */}
                <div className="w-full">
                    <BlogList
                        blogs={blogs}
                        userId={userId}
                        onBlogClick={handleView}
                        onEditBlog={handleEdit}
                        onDeleteBlog={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default Blog;