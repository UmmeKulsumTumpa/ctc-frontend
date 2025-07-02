import type { BlogPostService } from "../../types/blog.postservice.type";

interface BlogServiceListProps {
    services: BlogPostService[];
    onDelete?: (serviceId: string) => void;
}

const BlogServiceList = ({ services, onDelete }: BlogServiceListProps) => {
    if (!services.length) return <div className="text-gray-400">No services added.</div>;
    return (
        <ul className="space-y-2">
            {services.map((svc) => (
                <li key={svc.post_service_id} className="flex items-center gap-2 border-b pb-1">
                    <span className="font-semibold text-blue-700">{svc.service_id}</span>
                    {svc.cost && <span>Cost: {svc.cost}</span>}
                    {svc.rating && <span>Rating: {svc.rating}</span>}
                    {svc.visit_date && <span>Date: {svc.visit_date}</span>}
                    {svc.notes && <span>Notes: {svc.notes}</span>}
                    {svc.recommended && <span className="text-green-600">Recommended</span>}
                    {onDelete && (
                        <button onClick={() => onDelete(svc.post_service_id)} className="ml-auto px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default BlogServiceList;
