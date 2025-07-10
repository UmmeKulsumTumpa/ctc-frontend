import { useMap } from 'react-leaflet';
const MapCenterUpdater: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], map.getZoom(), { animate: true });
    }, [lat, lng, map]);
    return null;
};
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from 'react-leaflet';
import { setupLeafletIcons, reverseGeocode, forwardGeocode, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from './LeafletConfig';

interface SelectedLocation {
    lat: number;
    lng: number;
    name: string;
    address: string;
}

interface PlaceSearchMapProps {
    onLocationSelect: (location: SelectedLocation) => void;
    height?: string;
    defaultCenter?: [number, number];
    defaultZoom?: number;
    className?: string;
}

const LocationSelector: React.FC<{
    onLocationSelect: (location: SelectedLocation) => void;
    setSelectedLocation: (location: SelectedLocation | null) => void;
}> = ({ onLocationSelect, setSelectedLocation }) => {
    useMapEvents({
        async click(e: any) {
            const { lat, lng } = e.latlng;
            const geocodeResult = await reverseGeocode(lat, lng);
            
            const location: SelectedLocation = {
                lat,
                lng,
                name: geocodeResult.name,
                address: geocodeResult.address
            };
            
            setSelectedLocation(location);
            onLocationSelect(location);
        },
    });

    return null;
};

const PlaceSearchMap: React.FC<PlaceSearchMapProps> = ({
    onLocationSelect,
    height = '400px',
    defaultCenter = DEFAULT_MAP_CENTER,
    defaultZoom = DEFAULT_MAP_ZOOM,
    className = ''
}) => {
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SelectedLocation[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setupLeafletIcons();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        try {
            const results = await forwardGeocode(searchQuery);
            setSearchResults(results);
            setShowSearchResults(true);
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
            setShowSearchResults(true);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchResultClick = (result: SelectedLocation) => {
        setSelectedLocation(result);
        onLocationSelect(result);
        setShowSearchResults(false);
        setSearchQuery(result.name);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Search Bar */}
            <div className="mb-4 relative" ref={searchContainerRef}>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search for a place..."
                        value={searchQuery}
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            if (!e.target.value.trim()) {
                                setShowSearchResults(false);
                                setSearchResults([]);
                            }
                        }}
                        onKeyPress={handleKeyPress}
                        onFocus={() => {
                            if (searchResults.length > 0) {
                                setShowSearchResults(true);
                            }
                        }}
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        autoComplete="off"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                    >
                        {isSearching ? '🔄' : '🔍'}
                    </button>
                </div>
                {/* Search Results */}
                {showSearchResults && (
                    <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-300 rounded-lg mt-1 mr-15 max-h-60 overflow-y-auto shadow-lg" style={{ zIndex: 1000 }}>
                        {isSearching ? (
                            <div className="p-3 text-gray-500 text-center">
                                🔄 Searching...
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSearchResultClick(result)}
                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                                >
                                    <div className="font-medium text-gray-800">{result.name}</div>
                                    <div className="text-sm text-gray-600 mt-1">{result.address}</div>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-gray-500 text-center">
                                No results found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Map */}
            <div style={{ height }}>
                <MapContainer
                    center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : defaultCenter}
                    zoom={defaultZoom}
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-lg border-2 border-gray-300"
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    <ZoomControl position="bottomleft" />
                    {selectedLocation && (
                        <MapCenterUpdater lat={selectedLocation.lat} lng={selectedLocation.lng} />
                    )}
                    <LocationSelector 
                        onLocationSelect={onLocationSelect} 
                        setSelectedLocation={setSelectedLocation}
                    />
                    {selectedLocation && (
                        <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                    )}
                </MapContainer>
            </div>

            {/* Location Info */}
            {/* {selectedLocation && (
                <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-2">📍 Selected Location</h4>
                    <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {selectedLocation.name}</p>
                        <p><span className="font-medium">Address:</span> {selectedLocation.address}</p>
                        <p><span className="font-medium">Coordinates:</span> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default PlaceSearchMap;
