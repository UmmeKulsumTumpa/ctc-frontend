import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostImages, addPostImage, deletePostImage } from "../services/blogImage.service";
import BlogImageForm from "../components/blog/BlogImageForm";
import BlogImageList from "../components/blog/BlogImageList";
import type { BlogImage, BlogImageCreate } from "../types/blog.image.type";

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
        <div className="max-w-xl mx-auto py-8">
            <h2 className="text-xl font-bold mb-4">Manage Images</h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <BlogImageForm postId={id!} onSubmit={handleAdd} loading={loading} />
            <div className="mt-6">
                <BlogImageList images={images} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default BlogImageManage;
