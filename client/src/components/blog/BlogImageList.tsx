import type { BlogImage } from "../../types/blog.image.type";

interface BlogImageListProps {
    images: BlogImage[];
    onDelete?: (imageId: string) => void;
}

const BlogImageList = ({ images, onDelete }: BlogImageListProps) => {
    if (!images.length) return <div className="text-gray-400">No images added.</div>;
    return (
        <div className="flex flex-wrap gap-4">
            {images.map((img) => (
                <div key={img.url} className="relative">
                    <img src={img.url} alt={img.caption || ''} className="h-32 w-32 object-cover rounded border" />
                    {img.caption && <div className="text-xs text-center mt-1">{img.caption}</div>}
                    {onDelete && (
                        <button onClick={() => onDelete(img.image_id!)} className="absolute top-1 right-1 px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BlogImageList;
