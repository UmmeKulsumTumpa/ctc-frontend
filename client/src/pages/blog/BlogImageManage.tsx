import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostImages, addPostImage, deletePostImage } from "../../services/blog/blogImage.service";
import BlogImageForm from "../../components/blog/BlogImageForm";
import BlogImageList from "../../components/blog/BlogImageList";
import type { BlogImage, BlogImageCreate } from "../../types/blog/blog.image.type";

const BlogImageManage = () => {
    const { id } = useParams<{ id: string }>();
    const [images, setImages] = useState<BlogImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        getPostImages(id).then(setImages).catch(() => setError("Failed to load images."));
    }, [id]);

    const handleAdd = async (data: BlogImageCreate) => {
        setLoading(true);
        try {
            const img = await addPostImage(data);
            setImages((prev) => [...prev, img]);
        } catch {
            setError("Failed to add image.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (imageId: string) => {
        if (!id) return;
        try {
            await deletePostImage(id, imageId);
            setImages((prev) => prev.filter((img) => img.image_id !== imageId));
        } catch {
            setError("Failed to delete image.");
        }
    };

    return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold text-blue-900 mb-2">Manage Travel Photos</h2>
                        <p className="text-xl text-gray-600">Add or remove photos for this travel story</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl px-6 py-4 mb-8 text-lg font-medium">
                        ❌ {error}
                    </div>
                )}

                {/* Add Image Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <h3 className="text-2xl font-bold text-emerald-900 mb-6">Add New Photo</h3>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                        <BlogImageForm postId={id!} onSubmit={handleAdd} loading={loading} />
                    </div>
                </div>

                {/* Images List Section */}
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl p-8">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6">Current Photos</h3>
                    <BlogImageList images={images} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
};

export default BlogImageManage;
