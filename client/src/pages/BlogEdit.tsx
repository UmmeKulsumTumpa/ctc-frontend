import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogForm from "../components/blog/BlogForm";
import { getBlogById, updateBlog } from "../services/blog.service";
import type { BlogUpdate } from "../types/blog.type";

const BlogEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<Partial<BlogUpdate>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getBlogById(id)
            .then((res) => {
                setInitialValues(res);
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

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
    if (!initialValues) return null;

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Blog Post</h2>
            <BlogForm
                initialValues={initialValues}
                onSubmit={handleUpdate}
                submitLabel="Update"
                isEdit
            />
        </div>
    );
};

export default BlogEdit;
