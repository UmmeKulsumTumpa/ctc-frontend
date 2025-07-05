import { useState } from "react";
import type { BlogImageCreate } from "../../types/blog/blog.image.type";

interface BlogImageFormProps {
    postId: string;
    onSubmit: (data: BlogImageCreate) => void;
    loading?: boolean;
}

const BlogImageForm = ({ postId, onSubmit, loading }: BlogImageFormProps) => {
    const [url, setUrl] = useState("");
    const [caption, setCaption] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        onSubmit({
            post_id: postId,
            url,
            caption: caption || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white rounded-3xl p-6 border border-blue-200 shadow-lg">
            <label className="text-sm font-bold text-blue-900">
                Image URL <span className="text-red-500">*</span>
                <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                    required
                />
            </label>

            <label className="text-sm font-bold text-emerald-900">
                Image Caption
                <input
                    type="text"
                    placeholder="Describe this beautiful moment..."
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    className="border-2 border-emerald-200 rounded-xl px-4 py-3 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                />
            </label>

            <button
                type="submit"
                className="bg-blue-600 text-white rounded-xl px-6 py-3 mt-4 font-bold shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !url}
            >
                {loading ? "Adding Image..." : "Add Image to Blog"}
            </button>
        </form>
    );
};

export default BlogImageForm;
