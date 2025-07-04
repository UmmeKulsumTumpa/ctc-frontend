
import React, { useState } from 'react';
import type { PlannedPlace } from '../../types/travelPlan.type';



export interface TravelPlanPlacesFormProps {
    places: Partial<PlannedPlace>[];
    setPlaces: React.Dispatch<React.SetStateAction<Partial<PlannedPlace>[]>>;
}



const TravelPlanPlacesForm: React.FC<TravelPlanPlacesFormProps> = ({ places, setPlaces }) => {
    const [newPlaceId, setNewPlaceId] = useState('');
    const [newPriority, setNewPriority] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlaceId) {
            setError('Place ID is required.');
            return;
        }

        setError(null);
        setPlaces(prev => [...prev, { place_id: newPlaceId }]);
        setNewPlaceId('');
        setNewPriority('');
    };

    const handleRemove = (idx: number) => {
        setPlaces(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="mt-4 bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Planned Places</h3>
            <div className="flex gap-2 mb-2">
                <input
                    placeholder="Place ID"
                    value={newPlaceId}
                    onChange={e => setNewPlaceId(e.target.value)}
                    className="border rounded px-2 py-1"
                    required
                />
                <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    <option value="">Priority</option>
                    <option value="MustVisit">MustVisit</option>
                    <option value="Optional">Optional</option>
                </select>
                <button type="button" className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleAdd}>Add</button>
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <ul className="space-y-1">
                {places.map((place, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        <span className="font-mono">{place.place_id}</span>
                        <span className="text-xs text-gray-500">{place.priority}</span>
                        <button type="button" className="text-red-500 ml-2" onClick={() => handleRemove(idx)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TravelPlanPlacesForm;
