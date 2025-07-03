import { useState } from "react";
import type { BlogImageCreate } from "../../types/blog.image.type";

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-xl p-4 border border-blue-100 shadow">
            <label className="text-sm font-semibold text-blue-900">
                Image URL <span className="text-red-500">*</span>
                <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="border-2 border-blue-200 rounded px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                />
            </label>
            <input
                type="text"
                placeholder="Caption (optional)"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="border-2 border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button type="submit" className="bg-blue-200 text-blue-900 rounded-lg px-5 py-2 mt-2 font-bold shadow hover:bg-blue-300 transition" disabled={loading}>
                {loading ? "Adding..." : "Add Image"}
            </button>
        </form>
    );
};

export default BlogImageForm;
