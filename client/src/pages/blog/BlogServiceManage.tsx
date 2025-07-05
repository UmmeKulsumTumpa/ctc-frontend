import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostServices, addPostService, deletePostService } from "../../services/blog/blogPostService.service";
import BlogServiceForm from "../../components/blog/BlogServiceForm";
import BlogServiceList from "../../components/blog/BlogServiceList";
import type { BlogPostService, BlogPostServiceCreate } from "../../types/blog/blog.postservice.type";

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
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold text-emerald-900 mb-2">Manage Travel Services</h2>
                        <p className="text-xl text-gray-600">Add or remove services for this travel story</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl px-6 py-4 mb-8 text-lg font-medium">
                        ❌ {error}
                    </div>
                )}

                {/* Add Service Section */}
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl p-8 mb-10">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6">Add New Service</h3>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                        <BlogServiceForm postId={id!} onSubmit={handleAdd} loading={loading} />
                    </div>
                </div>

                {/* Services List Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8">
                    <h3 className="text-2xl font-bold text-emerald-900 mb-6">Current Services</h3>
                    <BlogServiceList services={services} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
};

export default BlogServiceManage;
