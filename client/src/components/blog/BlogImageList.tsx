import type { BlogImage } from "../../types/blog/blog.image.type";

interface BlogImageListProps {
    images: BlogImage[];
    onDelete?: (imageId: string) => void;
}

const BlogImageList = ({ images, onDelete }: BlogImageListProps) => {
    if (!images.length) {
        return (
            <div className="text-center py-12 bg-blue-50 rounded-3xl border border-blue-200">
                <div className="text-blue-600 text-lg font-bold mb-2">No Images Yet</div>
                <div className="text-blue-500">Add some beautiful photos to bring your travel story to life!</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((img) => (
                <div key={img.url} className="relative group">
                    <div className="bg-white rounded-3xl p-4 border border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                        <img
                            src={img.url}
                            alt={img.caption || 'Travel photo'}
                            className="w-full h-48 object-cover rounded-2xl border-2 border-blue-100"
                        />
                        {img.caption && (
                            <div className="mt-3 text-sm text-center text-blue-900 bg-blue-50 rounded-xl px-3 py-2 border border-blue-100 font-medium">
                                {img.caption}
                            </div>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(img.image_id!)}
                                className="absolute top-2 right-2 px-3 py-1 text-xs bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogImageList;
