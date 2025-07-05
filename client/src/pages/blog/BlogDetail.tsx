import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, deleteBlog, likeBlog } from "../../services/blog/blog.service";
import { getPostServices } from "../../services/blog/blogPostService.service";
import { getPostImages } from "../../services/blog/blogImage.service";
import type { BlogPost } from "../../types/blog/blog.type";
import BlogDetailCard from "../../components/blog/BlogDetailCard";
import { useAuth } from "../../contexts/AuthContext";

const BlogDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.user_id?.toString() ?? null;
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [likeLoading, setLikeLoading] = useState(false);
    const [services, setServices] = useState<any[]>([]);
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        Promise.all([
            getBlogById(id),
            getPostServices(id),
            getPostImages(id)
        ])
            .then(([blog, services, images]) => {
                setBlog(blog);
                setServices(services);
                setImages(images);
            })
            .catch(() => setError("Failed to load blog details."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center text-emerald-600 text-2xl font-bold animate-pulse">
                    📖 Loading this travel story...
                </div>
            </div>
        </div>
    );
    
    if (error || !blog) return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center text-red-500 text-lg font-semibold">
                    ❌ {error || "Story not found."}
                </div>
            </div>
        </div>
    );

    const handleDelete = async () => {
        if (!blog) return;
        if (window.confirm('Are you sure you want to delete this amazing story?')) {
            try {
                await deleteBlog(blog.post_id);
                navigate('/blogs');
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Failed to delete blog.');
            }
        }
    };

    const handleLike = async () => {
        if (!blog) return;
        setLikeLoading(true);
        try {
            await likeBlog(blog.post_id);
            setBlog({ ...blog, likes: blog.likes + 1 });
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to like this story.");
        } finally {
            setLikeLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Hero Section with Back Button */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-xl bg-blue-200 text-gray-800 font-bold border-2 border-gray-300 hover:bg-gray-300 transition-all"
                        >
                            ← Back to Stories
                        </button>
                        <div className="text-center">
                            <h1 className="text-5xl font-bold text-emerald-900">Travel Story</h1>
                            <p className="text-xl text-gray-600">Experience this amazing journey</p>
                        </div>
                        <div className="w-32"></div> {/* Spacer for balance */}
                    </div>
                </div>

                {/* Main Content with Enhanced Framing */}
                <div className="bg-white border-4 border-blue-300 shadow-2xl rounded-3xl p-8">
                    <BlogDetailCard
                        post={blog}
                        services={services}
                        images={images}
                        userId={userId}
                        onView={() => navigate(-1)}
                        onEdit={() => navigate(`/blogs/${blog.post_id}/edit`)}
                        onDelete={handleDelete}
                        onLike={likeLoading ? undefined : handleLike}
                        viewLabel="← Back to Stories"
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
