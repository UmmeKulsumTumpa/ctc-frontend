import { useState } from "react";
import type { BlogPostServiceCreate } from "../../types/blog/blog.postservice.type";
import ServiceAutocompleteField from '../service/ServiceAutocompleteField';

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white rounded-3xl p-6 border border-blue-200 shadow-lg">
            <ServiceAutocompleteField
                value={serviceId}
                onChange={id => setServiceId(id)}
                label={"Service *"}
                required
            />

            <label className="text-sm font-bold text-emerald-900">
                Cost (Optional)
                <input
                    type="number"
                    placeholder="Enter cost amount"
                    value={cost ?? ""}
                    onChange={e => setCost(e.target.value ? Number(e.target.value) : undefined)}
                    className="border-2 border-emerald-200 rounded-xl px-4 py-3 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                />
            </label>

            <label className="text-sm font-bold text-blue-900">
                Rating (1-5)
                <input
                    type="number"
                    placeholder="Rate this service"
                    min="1"
                    max="5"
                    value={rating ?? ""}
                    onChange={e => setRating(e.target.value ? Number(e.target.value) : undefined)}
                    className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                />
            </label>

            <label className="text-sm font-bold text-emerald-900">
                Visit Date
                <input
                    type="date"
                    value={visitDate}
                    onChange={e => setVisitDate(e.target.value)}
                    className="border-2 border-emerald-200 rounded-xl px-4 py-3 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                />
            </label>

            <label className="text-sm font-bold text-blue-900">
                Additional Notes
                <textarea
                    placeholder="Share your experience with this service..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors resize-none"
                />
            </label>

            <label className="flex items-center gap-3 text-emerald-900 font-bold">
                <input
                    type="checkbox"
                    checked={recommended}
                    onChange={e => setRecommended(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                I recommend this service to other travelers
            </label>

            <button
                type="submit"
                className="bg-blue-600 text-white rounded-xl px-6 py-3 mt-4 font-bold shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !serviceId}
            >
                {loading ? "Adding Service..." : "Add Service to Blog"}
            </button>
        </form>
    );
};

export default BlogServiceForm;
