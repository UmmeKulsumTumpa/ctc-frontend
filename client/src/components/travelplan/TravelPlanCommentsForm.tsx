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
        <div className="bg-gray-50 p-4 rounded">
            <input
                placeholder="Comment"
                value={comment.content || ''}
                onChange={e => handleChange('content', e.target.value)}
                className="border rounded px-2 py-1 flex-1"
                required
            />
            {formError && <div className="text-xs text-red-500 mt-1">Required fields missing</div>}
        </div>
    );
};

export default TravelPlanCommentsForm;
