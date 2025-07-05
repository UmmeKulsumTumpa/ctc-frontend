import React, { useState, useEffect } from 'react';
import type { PlanComment } from '../../types/travelPlan.type';

export interface TravelPlanCommentsFormProps {
    initialData?: Partial<PlanComment>;
    onChange: (data: Partial<PlanComment>) => void;
    formError?: boolean;
}

const TravelPlanCommentsForm: React.FC<TravelPlanCommentsFormProps> = ({ initialData = {}, onChange, formError }) => {
    const [comment, setComment] = useState<Partial<PlanComment>>(initialData);

    useEffect(() => { setComment(initialData); }, [initialData]);

    const handleChange = (field: keyof PlanComment, value: any) => {
        const updated = { ...comment, [field]: value };
        setComment(updated);
        onChange(updated);
    };

    return (
        <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-6">
            <div>
                <label className="block font-bold mb-2 text-emerald-900">
                    Your Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                    placeholder="Share your thoughts about this travel plan..."
                    value={comment.content || ''}
                    onChange={e => handleChange('content', e.target.value)}
                    className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors resize-none"
                    rows={3}
                    required
                />
            </div>

            {formError && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold mt-3">
                    Comment content is required
                </div>
            )}
        </div>
    );
};

export default TravelPlanCommentsForm;
