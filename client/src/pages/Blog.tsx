import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBlogs } from "../services/blog.service";
import type { BlogPost } from "../types/blog.type";
import BlogList from "../components/cards/BlogList";
import { useAuth } from "../contexts/AuthContext";
import { PATHS } from "../constants/path.constants";

const Blog = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const userId = user?.user_id?.toString() ?? null;
    const navigate = useNavigate();

    const handleView = (blog: BlogPost) => {
        navigate(PATHS.BLOG_DETAIL.replace(':id', blog.post_id));
    };
    const handleEdit = (blog: BlogPost) => {
        // navigate to blog edit page
    };
    const handleDelete = (blog: BlogPost) => {
        // show delete confirmation
    };

    useEffect(() => {
        getAllBlogs()
            .then(setBlogs)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center mt-10">Loading blogs...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 min-h-[80vh] px-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Travel Blogs</h2>
            <BlogList
                blogs={blogs}
                userId={userId}
                onBlogClick={handleView}
                onEditBlog={handleEdit}
                onDeleteBlog={handleDelete}
            />
        </div>
    );
};

export default Blog;