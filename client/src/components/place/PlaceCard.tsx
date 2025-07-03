import React from 'react';
import type { PlaceDto } from '../../types/place.type';

interface PlaceCardProps {
    place: PlaceDto;
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onDelete, showActions }) => {
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this place?')) {
            onDelete && place.place_id && onDelete(place.place_id);
        }
    };

    return (
        <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-blue-200 flex flex-col gap-2 font-sans">
            <h3 className="text-xl font-bold text-blue-800 mb-1">{place.name}</h3>

            {place.address && <p className="text-sm text-blue-900">Address: {place.address}</p>}

            <p className="text-sm text-blue-900">Location: {place.latitude}, {place.longitude}</p>

            {place.notes && <p className="text-sm text-blue-900">Notes: {place.notes}</p>}

            {showActions && (
                <div className="flex gap-2 mt-3">
                    {/** edit button will be added later */}
                    <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold shadow hover:bg-red-600 transition">Delete</button>
                </div>
            )}
            
        </div>
    );
};

export default PlaceCard;
