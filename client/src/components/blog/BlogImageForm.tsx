import { useState } from "react";
import { uploadToCloudinary } from "../../utils/cloudinary";
import type { BlogImageCreate } from "../../types/blog/blog.image.type";

interface BlogImageFormProps {
    postId: string;
    onSubmit: (data: BlogImageCreate) => void;
    loading?: boolean;
}

const BlogImageForm = ({ postId, onSubmit, loading }: BlogImageFormProps) => {
    const [url, setUrl] = useState("");
    const [caption, setCaption] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const uploadedUrl = await uploadToCloudinary(file);
            setUrl(uploadedUrl);
        } catch (err) {
            setError('Image upload failed. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

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
            {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-4 py-3 font-semibold">
                    {error}
                </div>
            )}
            
            <div className="space-y-4">
                <label className="text-sm font-bold text-emerald-900">
                    Choose Image <span className="text-red-500">*</span>
                </label>
                
                <div className="flex flex-col items-center gap-4">
                    <label className="cursor-pointer">
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl px-6 py-4 text-center hover:bg-emerald-100 transition-colors">
                            <span className="text-emerald-800 font-semibold">
                                {uploading ? "Uploading..." : "Click to choose image"}
                            </span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                    
                    {url && (
                        <div className="bg-white">
                            <img 
                                src={url} 
                                alt="Preview" 
                                className="h-32 w-32 rounded-lg object-cover border border-emerald-100" 
                            />
                            <p className="text-emerald-700 text-sm mt-2 text-center font-medium">Image ready!</p>
                        </div>
                    )}
                </div>
            </div>

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
                className="bg-emerald-600 text-white rounded-xl px-6 py-3 mt-4 font-bold shadow-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !url}
            >
                {loading ? "Adding Image..." : "Add Image to Blog"}
            </button>
        </form>
    );
};

export default BlogImageForm;
