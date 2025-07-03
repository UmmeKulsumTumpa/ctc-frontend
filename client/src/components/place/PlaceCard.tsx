import React from 'react';
import type { PlaceDto } from '../../types/place.type';

interface PlaceCardProps {
    place: PlaceDto;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
    return (
        <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-blue-200 flex flex-col gap-2 font-sans w-200">
            <h3 className="text-xl font-bold text-blue-800 mb-1">{place.name}</h3>

            {place.address && <p className="text-sm text-blue-900">Address: {place.address}</p>}

            <p className="text-sm text-blue-900">Location: {place.latitude}, {place.longitude}</p>

            {place.notes && <p className="text-sm text-blue-900">Notes: {place.notes}</p>}
        </div>
    );
};

export default PlaceCard;
