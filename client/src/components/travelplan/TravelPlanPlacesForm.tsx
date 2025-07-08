import React, { useState, useEffect } from 'react';
import type { PlannedPlace } from '../../types/travelPlan.type';
import PlaceAutocomplete from '../place/PlaceAutocomplete';
import type { VisitPriority } from '../../types/travelPlan.type';

export interface TravelPlanPlacesFormProps {
    initialData?: Partial<PlannedPlace>;
    onChange: (data: Partial<PlannedPlace>) => void;
    formError?: boolean;
}


const TravelPlanPlacesForm: React.FC<TravelPlanPlacesFormProps> = ({ initialData = {}, onChange, formError }) => {
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [priority, setPriority] = useState<string>(initialData.priority || '');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData && initialData.place_id && (!selectedPlace || selectedPlace.place_id !== initialData.place_id)) {
            setSelectedPlace({ place_id: initialData.place_id, name: initialData.place_id });
        }
        setPriority(initialData.priority || '');
    }, [initialData]);

    useEffect(() => {
        const data: Partial<PlannedPlace> = {
            place_id: selectedPlace?.place_id || ''
        };
        if (priority === 'MustVisit' || priority === 'Optional') {
            data.priority = priority as VisitPriority;
        }
        onChange(data);
    }, [selectedPlace, priority, onChange]);

    const handlePlaceSelect = (place: any) => {
        setSelectedPlace(place);
        setError(null);
    };

    return (
        <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-6 space-y-4">
            <PlaceAutocomplete
                selectedPlace={selectedPlace}
                onPlaceSelect={handlePlaceSelect}
                label="Travel Destination"
                placeholder="Search for a place to visit..."
                required={true}
                error={error}
                className="mb-4"
            />

            <div>
                <label className="block font-bold mb-2 text-emerald-900">
                    Visit Priority
                </label>
                <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
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
