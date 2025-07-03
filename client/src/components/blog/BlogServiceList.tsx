import type { BlogPostService } from "../../types/blog/blog.postservice.type";

interface BlogServiceListProps {
    services: BlogPostService[];
    onDelete?: (serviceId: string) => void;
}

const BlogServiceList = ({ services, onDelete }: BlogServiceListProps) => {
    if (!services.length) return <div className="text-blue-400 font-semibold py-4">No services added.</div>;
    return (
        <ul className="space-y-3">
            {services.map((svc) => (
                <li key={svc.post_service_id} className="flex items-center gap-3 border-b border-blue-100 pb-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                    <span className="font-semibold text-green-800">{svc.service_id}</span>
                    {svc.cost && <span className="text-green-700">Cost: <span className="font-bold">{svc.cost}</span></span>}
                    {svc.rating && <span className="text-blue-700">Rating: <span className="font-bold">{svc.rating}</span></span>}
                    {svc.visit_date && <span className="text-blue-900">Date: {svc.visit_date}</span>}
                    {svc.notes && <span className="italic text-blue-900">Notes: {svc.notes}</span>}
                    {svc.recommended && <span className="text-xs bg-green-200 text-green-800 rounded-full px-2 py-0.5 ml-2 border border-green-300">Recommended</span>}
                    {onDelete && (
                        <button onClick={() => onDelete(svc.post_service_id)} className="ml-auto px-3 py-1 text-xs bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Delete</button>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default BlogServiceList;
