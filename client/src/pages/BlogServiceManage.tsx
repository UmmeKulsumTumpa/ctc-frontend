import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostServices, addPostService, deletePostService } from "../services/blogPostService.service";
import BlogServiceForm from "../components/blog/BlogServiceForm";
import BlogServiceList from "../components/blog/BlogServiceList";
import type { BlogPostService, BlogPostServiceCreate } from "../types/blog.postservice.type";

const BlogServiceManage = () => {
    const { id } = useParams<{ id: string }>();
    const [services, setServices] = useState<BlogPostService[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        getPostServices(id).then(setServices).catch(() => setError("Failed to load services."));
    }, [id]);

    const handleAdd = async (data: BlogPostServiceCreate) => {
        setLoading(true);
        try {
            const svc = await addPostService(data);
            setServices((prev) => [...prev, svc]);
        } catch {
            setError("Failed to add service.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postServiceId: string) => {
        if (!id) return;
        try {
            await deletePostService(id, postServiceId);
            setServices((prev) => prev.filter((s) => s.post_service_id !== postServiceId));
        } catch {
            setError("Failed to delete service.");
        }
    };

    return (
        <div className="max-w-xl mx-auto py-8">
            <h2 className="text-xl font-bold mb-4">Manage Services</h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <BlogServiceForm postId={id!} onSubmit={handleAdd} loading={loading} />
            <div className="mt-6">
                <BlogServiceList services={services} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default BlogServiceManage;
