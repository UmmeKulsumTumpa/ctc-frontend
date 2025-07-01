import { useEffect, useState } from "react";
import { fetchPublicBlog } from "../services/blog.service";
import type { BlogPost } from "../types/blog.type";
import BlogCard from "../components/cards/BlogCard";

const Blogs = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPublicBlog()
            .then(setBlogs)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center mt-10">Loading blogs...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 min-h-[80vh] px-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Travel Blogs</h2>
            {blogs.length === 0 ? (
                <p>No public blogs available.</p>
            ) : (
                <ul className="space-y-6">
                    {blogs.map((post) => (
                        <li key={post.post_id}>
                            <BlogCard post={post} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Blogs;