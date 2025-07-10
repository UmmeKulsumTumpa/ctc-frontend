import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { setupLeafletIcons, createCustomIcon } from './LeafletConfig';

interface PlaceDisplayMapProps {
    latitude: number;
    longitude: number;
    placeName?: string;
    address?: string;
    height?: string;
    zoom?: number;
    markerColor?: string;
    showPopup?: boolean;
    className?: string;
}

const PlaceDisplayMap: React.FC<PlaceDisplayMapProps> = ({
    latitude,
    longitude,
    placeName = 'Selected Location',
    address,
    height = '400px',
    zoom = 15,
    markerColor = 'blue',
    showPopup = true,
    className = ''
}) => {
    useEffect(() => {
        setupLeafletIcons();
    }, []);

    const customIcon = createCustomIcon(markerColor);

    return (
        <div className={`w-full ${className}`} style={{ height }}>
            <MapContainer
                center={[latitude, longitude]}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg border-2 border-gray-300"
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <ZoomControl position="bottomleft" />

                <Marker position={[latitude, longitude]} icon={customIcon}>
                    {showPopup && (
                        <Popup>
                            <div className="text-center">
                                <h4 className="font-bold text-gray-800">{placeName}</h4>
                                {address && (
                                    <p className="text-sm text-gray-600 mt-1">{address}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                                </p>
                            </div>
                        </Popup>
                    )}
                </Marker>
            </MapContainer>
        </div>
    );
};

export default PlaceDisplayMap;
