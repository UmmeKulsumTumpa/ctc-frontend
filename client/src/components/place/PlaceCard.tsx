import React from 'react';
import type { PlaceDto } from '../../types/place.type';

interface PlaceCardProps {
    place: PlaceDto;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
    return (
        <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-emerald-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {place.name}
                </h3>
            </div>

            <div className="space-y-3">
                {place.address && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                        <div className="text-emerald-600 text-sm font-medium mb-1">Address</div>
                        <div className="text-emerald-900 font-semibold">{place.address}</div>
                    </div>
                )}

                <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
                    <div className="text-sky-600 text-sm font-medium mb-1">Coordinates</div>
                    <div className="text-sky-900 font-semibold">{place.latitude}, {place.longitude}</div>
                </div>

                {place.notes && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <div className="text-gray-600 text-sm font-medium mb-1">Notes</div>
                        <div className="text-gray-900 font-semibold">{place.notes}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaceCard;
