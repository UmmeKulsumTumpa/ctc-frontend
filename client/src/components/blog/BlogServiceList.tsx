import type { BlogPostService } from "../../types/blog/blog.postservice.type";

interface BlogServiceListProps {
    services: BlogPostService[];
    onDelete?: (serviceId: string) => void;
}

const BlogServiceList = ({ services, onDelete }: BlogServiceListProps) => {
    if (!services.length) {
        return (
            <div className="text-center py-12 bg-emerald-50 rounded-3xl border border-emerald-200">
                <div className="text-emerald-600 text-lg font-bold mb-2">No Services Added</div>
                <div className="text-emerald-500">Share the amazing services you discovered during your travels!</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {services.map((svc) => (
                <div key={svc.post_service_id} className="bg-white rounded-3xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-shadow group">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg text-blue-900 truncate">Service: {svc.service_id}</h4>
                        </div>
                        {onDelete && (
                            <button
                                onClick={() => onDelete(svc.post_service_id)}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {svc.cost && (
                            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                                <div className="text-emerald-600 text-sm font-medium">Cost</div>
                                <div className="text-emerald-900 font-bold text-lg">${svc.cost}</div>
                            </div>
                        )}
                        {svc.rating && (
                            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                                <div className="text-blue-600 text-sm font-medium">Rating</div>
                                <div className="text-blue-900 font-bold text-lg">{svc.rating}/5 ⭐</div>
                            </div>
                        )}
                        {svc.visit_date && (
                            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                                <div className="text-blue-600 text-sm font-medium">Visit Date</div>
                                <div className="text-blue-900 font-bold">{new Date(svc.visit_date).toLocaleDateString()}</div>
                            </div>
                        )}
                        {svc.recommended && (
                            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 flex items-center justify-center">
                                <span className="text-emerald-900 font-bold text-sm">✅ Recommended</span>
                            </div>
                        )}
                    </div>

                    {svc.notes && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="text-gray-600 text-sm font-medium mb-1">Notes</div>
                            <div className="text-gray-900 italic">{svc.notes}</div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BlogServiceList;
