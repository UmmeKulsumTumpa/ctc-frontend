import React, { useState, useEffect } from 'react';
import type { PlannedPlace } from '../../types/travelPlan.type';

export interface TravelPlanPlacesFormProps {
    initialData?: Partial<PlannedPlace>;
    onChange: (data: Partial<PlannedPlace>) => void;
    formError?: boolean;
}

const TravelPlanPlacesForm: React.FC<TravelPlanPlacesFormProps> = ({ initialData = {}, onChange, formError }) => {
    const [place, setPlace] = useState<Partial<PlannedPlace>>(initialData);

    useEffect(() => { setPlace(initialData); }, [initialData]);

    const handleChange = (field: keyof PlannedPlace, value: any) => {
        const updated = { ...place, [field]: value };
        setPlace(updated);
        onChange(updated);
    };

    return (
        <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-6 space-y-4">
            <div>
                <label className="block font-bold mb-2 text-emerald-900">
                    Place ID <span className="text-red-500">*</span>
                </label>
                <input
                    placeholder="Enter the place identifier"
                    value={place.place_id || ''}
                    onChange={e => handleChange('place_id', e.target.value)}
                    className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                    required
                />
            </div>

            <div>
                <label className="block font-bold mb-2 text-emerald-900">
                    Visit Priority
                </label>
                <select
                    value={place.priority || ''}
                    onChange={e => handleChange('priority', e.target.value as any)}
                    className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                >
                    <option value="">Choose priority level</option>
                    <option value="MustVisit">Must Visit</option>
                    <option value="Optional">Optional</option>
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

export default TravelPlanPlacesForm;
