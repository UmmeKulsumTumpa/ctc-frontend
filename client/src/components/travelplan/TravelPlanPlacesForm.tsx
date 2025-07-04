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
        <div className="bg-gray-50 p-4 rounded">
            <input
                placeholder="Place ID"
                value={place.place_id || ''}
                onChange={e => handleChange('place_id', e.target.value)}
                className="border rounded px-2 py-1 flex-1"
                required
            />
            <select
                value={place.priority || ''}
                onChange={e => handleChange('priority', e.target.value as any)}
                className="border rounded px-2 py-1 flex-1 mt-2"
            >
                <option value="">Priority</option>
                <option value="MustVisit">MustVisit</option>
                <option value="Optional">Optional</option>
            </select>
            {formError && <div className="text-xs text-red-500 mt-1">Required fields missing</div>}
        </div>
    );
};

export default TravelPlanPlacesForm;
