import React, { useState, useEffect } from 'react';
import type { TravelPlanServiceUnifiedDTO } from '../../types/travelPlan.type';

export interface TravelPlanServicesFormProps {
    initialData?: Partial<TravelPlanServiceUnifiedDTO>;
    onChange: (data: Partial<TravelPlanServiceUnifiedDTO>) => void;
    formError?: boolean;
}

const TravelPlanServicesForm: React.FC<TravelPlanServicesFormProps> = ({ initialData = {}, onChange, formError }) => {
    const [service, setService] = useState<Partial<TravelPlanServiceUnifiedDTO>>(initialData);

    useEffect(() => { setService(initialData); }, [initialData]);

    const handleChange = (field: keyof TravelPlanServiceUnifiedDTO, value: any) => {
        const updated = { ...service, [field]: value };
        setService(updated);
        onChange(updated);
    };

    return (
        <div className="bg-gray-50 p-4 rounded">
            <input
                placeholder="Service ID"
                value={service.service_id || ''}
                onChange={e => handleChange('service_id', e.target.value)}
                className="border rounded px-2 py-1 flex-1"
                required
            />
            <input
                placeholder="Notes (optional)"
                value={service.notes || ''}
                onChange={e => handleChange('notes', e.target.value)}
                className="border rounded px-2 py-1 flex-1 mt-2"
            />
            {formError && <div className="text-xs text-red-500 mt-1">Required fields missing</div>}
        </div>
    );
};

export default TravelPlanServicesForm;
