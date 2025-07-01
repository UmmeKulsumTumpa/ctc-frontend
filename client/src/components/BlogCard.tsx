import type { BlogPost } from "../types/blog.type";

interface BlogCardProps {
    post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => (
    <div className="bg-gray-100 p-6 rounded shadow">
        <h3 className="text-xl font-semibold">{post.title}</h3>
        <p className="text-gray-600 mb-2">
            Posted on {new Date(post.created_at).toLocaleDateString()}
        </p>
        <p className="text-gray-800">{post.description}</p>
    </div>
);

export default BlogCard;
