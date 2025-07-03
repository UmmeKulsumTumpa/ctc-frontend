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

    if (loading) return <div className="text-center py-16 text-blue-600 text-xl font-bold animate-pulse">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-16 text-lg font-semibold">{error}</div>;
    if (!initialValues) return null;

    return (
        <div className="py-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800 font-serif tracking-tight drop-shadow-lg">Edit Blog Post</h2>
            <BlogForm
                initialValues={initialValues}
                onSubmit={handleUpdate}
                submitLabel="Update"
            />
            <div className="mt-10">
                <h3 className="text-xl font-bold mb-3 text-green-800">Services</h3>
                <BlogServiceForm postId={id!} onSubmit={handleAddService} loading={svcLoading} />
                <div className="mt-4">
                    <BlogServiceList services={services} onDelete={handleDeleteService} />
                </div>
                <h3 className="text-xl font-bold mb-3 mt-10 text-blue-800">Images</h3>
                <BlogImageForm postId={id!} onSubmit={handleAddImage} loading={imgLoading} />
                <div className="mt-4">
                    <BlogImageList images={images} onDelete={handleDeleteImage} />
                </div>
            </div>
        </div>
    );
};

export default BlogEdit;
