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
        <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-6 space-y-4">
            <div>
                <label className="block font-bold mb-2 text-emerald-900">
                    Service ID <span className="text-red-500">*</span>
                </label>
                <input
                    placeholder="Enter the service identifier"
                    value={service.service_id || ''}
                    onChange={e => handleChange('service_id', e.target.value)}
                    className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                    required
                />
            </div>

            <div>
                <label className="block font-bold mb-2 text-blue-900">
                    Additional Notes
                </label>
                <input
                    placeholder="Any special requirements or notes about this service..."
                    value={service.notes || ''}
                    onChange={e => handleChange('notes', e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                />
            </div>

            {formError && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
                    ❌ Required fields are missing
                </div>
            )}
        </div>
    );
};

export default TravelPlanServicesForm;
