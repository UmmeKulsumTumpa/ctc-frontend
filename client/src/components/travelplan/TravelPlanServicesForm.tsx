
import React, { useState } from 'react';
import type { TravelPlanServiceUnifiedDTO } from '../../types/travelPlan.type';



export interface TravelPlanServicesFormProps {
    services: Partial<TravelPlanServiceUnifiedDTO>[];
    setServices: React.Dispatch<React.SetStateAction<Partial<TravelPlanServiceUnifiedDTO>[]>>;
}




const TravelPlanServicesForm: React.FC<TravelPlanServicesFormProps> = ({ services, setServices }) => {
    const [newServiceId, setNewServiceId] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newServiceId) {
            setError('Service ID is required.');
            return;
        }

        setError(null);
        setServices(prev => [...prev, { service_id: newServiceId }]);
        setNewServiceId('');
    };

    const handleRemove = (idx: number) => {
        setServices(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="mt-4 bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Planned Services</h3>
            <div className="flex gap-2 mb-2">
                <input
                    placeholder="Service ID"
                    value={newServiceId}
                    onChange={e => setNewServiceId(e.target.value)}
                    className="border rounded px-2 py-1"
                    required
                />
                <button type="button" className="bg-yellow-600 text-white px-3 py-1 rounded" onClick={handleAdd}>Add</button>
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <ul className="space-y-1">
                {services.map((service, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        <span className="font-mono">{service.service_id}</span>
                        <button type="button" className="text-red-500 ml-2" onClick={() => handleRemove(idx)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TravelPlanServicesForm;
