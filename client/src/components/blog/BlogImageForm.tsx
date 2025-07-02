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
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-sm font-medium">
                Image URL <span className="text-red-500">*</span>
                <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="border rounded px-3 py-2 w-full mt-1"
                    required
                />
            </label>
            <input
                type="text"
                placeholder="Caption (optional)"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="border rounded px-3 py-2"
            />
            <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 mt-2" disabled={loading}>
                {loading ? "Adding..." : "Add Image"}
            </button>
        </form>
    );
};

export default BlogImageForm;
