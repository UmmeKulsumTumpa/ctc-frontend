import { useState } from "react";
import type { BlogPostServiceCreate } from "../../types/blog.postservice.type";

interface BlogServiceFormProps {
    postId: string;
    onSubmit: (data: BlogPostServiceCreate) => void;
    loading?: boolean;
    initialData?: Partial<BlogPostServiceCreate>;
}


const BlogServiceForm = ({ postId, onSubmit, loading, initialData }: BlogServiceFormProps) => {
    const [serviceId, setServiceId] = useState(initialData?.service_id || "");
    const [cost, setCost] = useState<number | undefined>(initialData?.cost);
    const [rating, setRating] = useState<number | undefined>(initialData?.rating);
    const [visitDate, setVisitDate] = useState(initialData?.visit_date || "");
    const [notes, setNotes] = useState(initialData?.notes || "");
    const [recommended, setRecommended] = useState(initialData?.recommended || false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!serviceId) return;
        onSubmit({
            post_id: postId,
            service_id: serviceId,
            cost,
            rating,
            visit_date: visitDate || undefined,
            notes: notes || undefined,
            recommended,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-sm font-medium">
                Service ID <span className="text-red-500">*</span>
                <input
                    type="text"
                    value={serviceId}
                    onChange={e => setServiceId(e.target.value)}
                    className="border rounded px-3 py-2 w-full mt-1"
                    required
                />
            </label>
            <input
                type="number"
                placeholder="Cost"
                value={cost ?? ""}
                onChange={e => setCost(e.target.value ? Number(e.target.value) : undefined)}
                className="border rounded px-3 py-2"
            />
            <input
                type="number"
                placeholder="Rating"
                value={rating ?? ""}
                onChange={e => setRating(e.target.value ? Number(e.target.value) : undefined)}
                className="border rounded px-3 py-2"
            />
            <input
                type="date"
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
                className="border rounded px-3 py-2"
            />
            <input
                type="text"
                placeholder="Notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="border rounded px-3 py-2"
            />
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={recommended}
                    onChange={e => setRecommended(e.target.checked)}
                />
                Recommended
            </label>
            <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 mt-2" disabled={loading}>
                {loading ? "Adding..." : "Add Service"}
            </button>
        </form>
    );
};

export default BlogServiceForm;
