import type { BlogImage } from "../../types/blog/blog.image.type";

interface BlogImageListProps {
    images: BlogImage[];
    onDelete?: (imageId: string) => void;
}

const BlogImageList = ({ images, onDelete }: BlogImageListProps) => {
    if (!images.length) return <div className="text-blue-400 font-semibold py-4">No images added.</div>;
    return (
        <div className="flex flex-wrap gap-6">
            {images.map((img) => (
                <div key={img.url} className="relative flex flex-col items-center">
                    <img src={img.url} alt={img.caption || ''} className="h-36 w-36 object-cover rounded-xl border-2 border-blue-200 shadow-lg" />
                    {img.caption && <div className="text-xs text-center mt-2 text-blue-900 bg-blue-50 rounded px-2 py-1 border border-blue-100">{img.caption}</div>}
                    {onDelete && (
                        <button onClick={() => onDelete(img.image_id!)} className="absolute top-1 right-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Delete</button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BlogImageList;
