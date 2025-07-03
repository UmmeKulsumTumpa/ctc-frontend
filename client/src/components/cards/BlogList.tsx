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
		return <div className="text-center text-blue-400 py-12 text-lg font-semibold bg-white rounded-xl shadow-inner">No blogs found. Start by creating your first post!</div>;
	}
	return (
		<div className="flex flex-col gap-10 items-center w-full">
			{blogs.map((blog) => (
				<div key={blog.post_id} className="w-full max-w-xl flex flex-col h-full">
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
