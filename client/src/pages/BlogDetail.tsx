import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, deleteBlog, likeBlog } from "../services/blog.service";
import { getPostServices } from "../services/blogPostService.service";
import { getPostImages } from "../services/blogImage.service";
import type { BlogPost } from "../types/blog.type";
import BlogDetailCard from "../components/cards/BlogDetailCard";
import { useAuth } from "../contexts/AuthContext";

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

    if (loading) return <div className="text-center mt-10">Loading blog...</div>;
    if (error || !blog) return <div className="text-center mt-10 text-red-500">{error || "Blog not found."}</div>;

    const handleDelete = async () => {
        if (!blog) return;
        if (window.confirm('Are you sure you want to delete this blog?')) {
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
            setError(err?.response?.data?.message || "Failed to like blog.");
        } finally {
            setLikeLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 min-h-[80vh] px-4">
            <BlogDetailCard
                post={blog}
                services={services}
                images={images}
                userId={userId}
                onView={() => navigate(-1)}
                onEdit={() => navigate(`/blogs/${blog.post_id}/edit`)}
                onDelete={handleDelete}
                onLike={likeLoading ? undefined : handleLike}
                viewLabel="Back"
            />
        </div>
    );
};

export default BlogDetail;
