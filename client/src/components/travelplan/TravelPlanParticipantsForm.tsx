import React, { useState, useEffect } from 'react';
import type { PlanParticipant } from '../../types/travelPlan.type';

export interface TravelPlanParticipantsFormProps {
    initialData?: Partial<PlanParticipant>;
    onChange: (data: Partial<PlanParticipant>) => void;
    formError?: boolean;
}

const TravelPlanParticipantsForm: React.FC<TravelPlanParticipantsFormProps> = ({ initialData = {}, onChange, formError }) => {
    const [participant, setParticipant] = useState<Partial<PlanParticipant>>(initialData);

    useEffect(() => { setParticipant(initialData); }, [initialData]);

    const handleChange = (field: keyof PlanParticipant, value: any) => {
        const updated = { ...participant, [field]: value };
        setParticipant(updated);
        onChange(updated);
    };

    return (
        <div className="bg-gray-50 p-4 rounded">
            <input
                placeholder="User ID"
                value={participant.user_id ?? ''}
                onChange={e => handleChange('user_id', Number(e.target.value))}
                className="border rounded px-2 py-1 flex-1"
                required
            />
            <select
                value={participant.role_permission ?? ''}
                onChange={e => handleChange('role_permission', e.target.value as any)}
                className="border rounded px-2 py-1 flex-1 mt-2"
            >
                <option value="">Select Role (optional)</option>
                <option value="Owner">Owner</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
            </select>
            {formError && <div className="text-xs text-red-500 mt-1">Required fields missing</div>}
        </div>
    );
};

export default TravelPlanParticipantsForm;
