import React, { useState } from 'react';
import BaseModal from './BaseModal';
import PlaceSearchMap from '../maps/PlaceSearchMap';

interface SelectedLocation {
    lat: number;
    lng: number;
    name: string;
    address: string;
}

interface PlaceSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationConfirm: (location: SelectedLocation) => void;
    title?: string;
    description?: string;
    defaultCenter?: [number, number];
}

const PlaceSearchModal: React.FC<PlaceSearchModalProps> = ({
    isOpen,
    onClose,
    onLocationConfirm,
    title = 'Select Location',
    description = 'Search for a place or click on the map to select a location.',
    defaultCenter
}) => {
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

    const handleLocationSelect = (location: SelectedLocation) => {
        setSelectedLocation(location);
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            onLocationConfirm(selectedLocation);
            setSelectedLocation(null);
            onClose();
        }
    };

    const handleCancel = () => {
        setSelectedLocation(null);
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleCancel}
            title={title}
            size="xl"
            showCloseButton={false}
        >
            <div className="space-y-4">
                <p className="text-gray-600">{description}</p>

                <PlaceSearchMap
                    onLocationSelect={handleLocationSelect}
                    height="500px"
                    defaultCenter={defaultCenter}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedLocation}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        Confirm Selection
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default PlaceSearchModal;
