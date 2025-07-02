import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../services/blog.service";
import BlogForm from "../components/blog/BlogForm";
import type { BlogCreate } from "../types/blog.type";

const BlogCreate: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (data: BlogCreate) => {
        setLoading(true);
        setError(null);
        try {
            const created = await createBlog(data);
            navigate(`/blogs/${created.post_id}`);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create blog.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Create New Blog</h2>
            {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
            <BlogForm onSubmit={handleSubmit} submitLabel={loading ? "Creating..." : "Create"} />
        </div>
    );
};

export default BlogCreate;
