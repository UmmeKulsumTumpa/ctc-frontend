import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, deleteBlog } from "../services/blog.service";
import { getPostServices } from "../services/blogPostService.service";
import { getPostImages } from "../services/blogImage.service";
import type { BlogPost } from "../types/blog.type";
import type { BlogService } from "../types/blog.service.type";
import type { BlogImage } from "../types/blog.image.type";
import BlogDetailCard from "../components/cards/BlogDetailCard";
import { useAuth } from "../contexts/AuthContext";

const BlogDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.user_id?.toString() ?? null;
    const [blog, setBlog] = useState<BlogPost | null>(null);
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
                viewLabel="Back"
            />
            {/* <div className="mt-8">
                <h3 className="text-lg font-bold mb-2">Services</h3>
                <div className="mb-6">
                    {services.length === 0 ? <div className="text-gray-400">No services added.</div> : null}
                </div>
                <h3 className="text-lg font-bold mb-2">Images</h3>
                <div>
                    {images.length === 0 ? <div className="text-gray-400">No images added.</div> : null}
                </div>
            </div> */}
        </div>
    );
};

export default BlogDetail;
