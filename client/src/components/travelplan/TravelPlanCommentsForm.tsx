
import React, { useState } from 'react';
import type { PlanComment } from '../../types/travelPlan.type';



export interface TravelPlanCommentsFormProps {
    comments: Partial<PlanComment>[];
    setComments: React.Dispatch<React.SetStateAction<Partial<PlanComment>[]>>;
}

const TravelPlanCommentsForm: React.FC<TravelPlanCommentsFormProps> = ({ comments, setComments }) => {
    const [newContent, setNewContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newContent) {
            setError('Comment is required.');
            return;
        }
        setError(null);
        setComments(prev => [...prev, { content: newContent }]);
        setNewContent('');
    };

    const handleRemove = (idx: number) => {
        setComments(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="mt-4 bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Comments</h3>
            <div className="flex gap-2 mb-2">
                <input
                    placeholder="Comment"
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    className="border rounded px-2 py-1 flex-1"
                    required
                />
                <button type="button" className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleAdd}>Add</button>
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <ul className="space-y-1">
                {comments.map((comment, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        <span className="font-mono">{comment.content}</span>
                        <button type="button" className="text-red-500 ml-2" onClick={() => handleRemove(idx)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TravelPlanCommentsForm;
