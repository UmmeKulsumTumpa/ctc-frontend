import React from 'react';
import type { BlogPost } from '../../types/blog/blog.type';
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
		return (
			<div className="text-center py-16 bg-sky-50 rounded-3xl border-2 border-sky-200 shadow-lg">
				<div className="max-w-md mx-auto">
					<div className="text-sky-600 text-2xl font-bold mb-4">No Travel Stories Yet</div>
					<div className="text-sky-500 text-lg mb-6">Start sharing your amazing adventures with the world!</div>
					<div className="text-sky-400">Create your first travel blog post and inspire fellow travelers.</div>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
			{blogs.map((blog) => (
				<div key={blog.post_id} className="flex">
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
