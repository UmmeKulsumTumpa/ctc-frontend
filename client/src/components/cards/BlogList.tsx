import React from 'react';
import type { BlogPost } from '../../types/blog.type';
import BlogCard from './BlogCard';

interface BlogListProps {
  blogs: BlogPost[];
  userId?: string | null;
  onBlogClick?: (blog: BlogPost) => void;
  onEditBlog?: (blog: BlogPost) => void;
  onDeleteBlog?: (blog: BlogPost) => void;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, userId, onBlogClick, onEditBlog, onDeleteBlog }) => {
  if (!blogs.length) {
    return <div className="text-center text-blue-400 py-12 text-lg font-semibold bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-inner">No blogs found. Start by creating your first post!</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {blogs.map((blog) => (
        <div key={blog.post_id} className="flex flex-col h-full">
          <BlogCard
            post={blog}
            userId={userId}
            onView={() => onBlogClick?.(blog)}
            onEdit={() => onEditBlog?.(blog)}
            onDelete={() => onDeleteBlog?.(blog)}
          />
        </div>
      ))}
    </div>
  );
};

export default BlogList;
