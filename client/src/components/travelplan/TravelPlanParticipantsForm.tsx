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
        <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-6 space-y-4">
            <div>
                <label className="block font-bold mb-2 text-emerald-900">
                    User ID <span className="text-red-500">*</span>
                </label>
                <input
                    placeholder="Enter the user identifier"
                    value={participant.user_id ?? ''}
                    onChange={e => handleChange('user_id', Number(e.target.value))}
                    className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                    type="number"
                    required
                />
            </div>

            <div>
                <label className="block font-bold mb-2 text-sky-900">
                    Team Role
                </label>
                <select
                    value={participant.role_permission ?? ''}
                    onChange={e => handleChange('role_permission', e.target.value as any)}
                    className="w-full border-2 border-sky-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-colors"
                >
                    <option value="">Choose team role (optional)</option>
                    <option value="Owner">Owner</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                </select>
            </div>

            {formError && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
                    Required fields are missing
                </div>
            )}
        </div>
    );
};

export default TravelPlanParticipantsForm;
