import React, { useState } from 'react';
import type { PlaceDto } from '../../types/place.type';
import MapPinIcon from '../icons/MapPinIcon';
import PlaceDisplayModal from '../common/modals/PlaceDisplayModal';

interface PlaceCardProps {
    place: PlaceDto;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
    const [showMap, setShowMap] = useState(false);
    return (
        <>
            <div className="
        relative bg-white rounded-xl shadow-lg border-2 border-emerald-500
        hover:shadow-2xl transition p-6 flex flex-col gap-4">
                <button
                    onClick={() => setShowMap(true)}
                    aria-label="View location"
                    className="
                absolute top-4 right-4 
                bg-emerald-600 hover:bg-emerald-700 
                p-3 rounded-full shadow-md
                transition-colors text-white
                flex items-center justify-center
                focus:outline-none focus:ring-2 focus:ring-emerald-400
                    ">
                        <MapPinIcon size={24} />
                </button>

                {/* Title */}
                <h3 className="text-2xl font-bold text-emerald-800">
                    {place.name}
                </h3>

                {/* Address & Notes sections */}
                <div className="space-y-3 text-gray-800 text-sm">
                    {place.address && (
                        <div>
                            <div className="font-semibold text-emerald-600 uppercase tracking-wide">
                                Address
                            </div>
                            <div className="mt-1">{place.address}</div>
                        </div>
                    )}
                    {place.notes && (
                        <div>
                            <div className="font-semibold text-emerald-600 uppercase tracking-wide">
                                Notes
                            </div>
                            <div className="mt-1">{place.notes}</div>
                        </div>
                    )}
                </div>
            </div>

            <PlaceDisplayModal
                isOpen={showMap}
                onClose={() => setShowMap(false)}
                latitude={Number(place.latitude)}
                longitude={Number(place.longitude)}
                placeName={place.name}
                address={place.address}
                title={place.name}
            />
        </>
    );
};

export default PlaceCard;
