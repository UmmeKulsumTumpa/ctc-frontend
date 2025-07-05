import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogForm from "../../components/blog/BlogForm";
import { getBlogById, updateBlog } from "../../services/blog/blog.service";
import { getPostServices, deletePostService, addPostService } from "../../services/blog/blogPostService.service";
import { getPostImages, deletePostImage, addPostImage } from "../../services/blog/blogImage.service";
import BlogServiceList from "../../components/blog/BlogServiceList";
import BlogServiceForm from "../../components/blog/BlogServiceForm";
import BlogImageList from "../../components/blog/BlogImageList";
import BlogImageForm from "../../components/blog/BlogImageForm";
import type { BlogUpdate } from "../../types/blog/blog.type";
import type { BlogPostService, BlogPostServiceCreate } from "../../types/blog/blog.postservice.type";
import type { BlogImage, BlogImageCreate } from "../../types/blog/blog.image.type";

const BlogEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<Partial<BlogUpdate>>();
    const [services, setServices] = useState<BlogPostService[]>([]);
    const [images, setImages] = useState<BlogImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [svcLoading, setSvcLoading] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        Promise.all([
            getBlogById(id),
            getPostServices(id),
            getPostImages(id)
        ])
            .then(([blog, services, images]) => {
                setInitialValues(blog);
                setServices(services);
                setImages(images);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load blog post.");
                setLoading(false);
            });
    }, [id]);

    const handleUpdate = async (values: BlogUpdate) => {
        if (!id) return;
        try {
            await updateBlog(id, values);
            navigate(`/blogs/${id}`);
        } catch (e) {
            setError("Failed to update blog post.");
        }
    };

    const handleAddService = async (data: BlogPostServiceCreate) => {
        setSvcLoading(true);
        try {
            const svc = await addPostService(data);
            setServices((prev) => [...prev, svc]);
        } catch {
            setError("Failed to add service.");
        } finally {
            setSvcLoading(false);
        }
    };

    const handleDeleteService = async (postServiceId: string) => {
        if (!id) return;
        try {
            await deletePostService(id, postServiceId);
            setServices((prev) => prev.filter((s) => s.post_service_id !== postServiceId));
        } catch {
            setError("Failed to delete service.");
        }
    };

    const handleAddImage = async (data: BlogImageCreate) => {
        setImgLoading(true);
        try {
            const img = await addPostImage(data);
            setImages((prev) => [...prev, img]);
        } catch {
            setError("Failed to add image.");
        } finally {
            setImgLoading(false);
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        if (!id) return;
        try {
            await deletePostImage(id, imageId);
            setImages((prev) => prev.filter((img) => img.image_id !== imageId));
        } catch {
            setError("Failed to delete image.");
        }
    };

    if (loading) return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center text-emerald-600 text-2xl font-bold animate-pulse">
                    📝 Loading your story for editing...
                </div>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center text-red-500 text-lg font-semibold">
                    ❌ {error}
                </div>
            </div>
        </div>
    );
    
    if (!initialValues) return null;

    return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold text-emerald-900 mb-2">Edit Your Story</h2>
                        <p className="text-xl text-gray-600">Update your travel adventure</p>
                    </div>
                </div>

                {/* Main Form Container */}
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl p-8 mb-10">
                    <BlogForm
                        initialValues={initialValues}
                        onSubmit={handleUpdate}
                        submitLabel="Update Story"
                    />
                </div>

                {/* Services Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <h3 className="text-2xl font-bold text-emerald-900 mb-6">Manage Travel Services</h3>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">
                        <BlogServiceForm postId={id!} onSubmit={handleAddService} loading={svcLoading} />
                    </div>
                    <BlogServiceList services={services} onDelete={handleDeleteService} />
                </div>

                {/* Images Section */}
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl p-8">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6">Manage Travel Photos</h3>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">
                        <BlogImageForm postId={id!} onSubmit={handleAddImage} loading={imgLoading} />
                    </div>
                    <BlogImageList images={images} onDelete={handleDeleteImage} />
                </div>
            </div>
        </div>
    );
};

export default BlogEdit;
