import { useState, useEffect, useRef } from 'react';
import { getAllPlaces } from '../../services/place.service';
import type { PlaceDto } from '../../types/place.type';

interface PlaceAutocompleteProps {
    selectedPlace: PlaceDto | null;
    onPlaceSelect: (place: PlaceDto | null) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    maxSuggestions?: number;
    className?: string;
    error?: string | null;
}

const PlaceAutocomplete = ({
    selectedPlace,
    onPlaceSelect,
    placeholder = "Search for a destination...",
    label = "Destination",
    required = false,
    maxSuggestions = 7,
    className = "",
    error = null
}: PlaceAutocompleteProps) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<PlaceDto[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedPlace) {
            setInput(selectedPlace.name);
        }
    }, [selectedPlace]);

    const searchPlaces = async (searchTerm: string) => {
        if (!searchTerm.trim()) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const places = await getAllPlaces({ name: searchTerm });
            const filteredPlaces = places
                .filter(place =>
                    place.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, maxSuggestions);
            setSuggestions(filteredPlaces);
        } catch (error) {
            console.error('Error fetching places:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);
        setShowSuggestions(true);

        if (!value.trim()) {
            onPlaceSelect(null);
            setSuggestions([]);
            return;
        }

        searchPlaces(value);
    };

    const handlePlaceSelect = (place: PlaceDto) => {
        setInput(place.name);
        onPlaceSelect(place);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleInputFocus = () => {
        if (input && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleInputBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    const clearSelection = () => {
        setInput('');
        onPlaceSelect(null);
        setSuggestions([]);
        inputRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`}>
            <label className="block font-bold mb-2 text-emerald-900">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder={placeholder}
                    className={`w-full border-2 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 transition-colors pr-10 ${error
                            ? 'border-red-200 focus:ring-red-400 focus:border-red-400'
                            : 'border-emerald-200 focus:ring-emerald-400 focus:border-emerald-400'
                        }`}
                    required={required}
                />

                {selectedPlace && (
                    <button
                        type="button"
                        onClick={clearSelection}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-800 transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>

            {error && (
                <div className="mt-1 text-red-600 text-sm font-medium">
                    {error}
                </div>
            )}

            {loading && (
                <div className="mt-2 text-emerald-600 text-sm">
                    🔍 Searching places...
                </div>
            )}

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border-2 border-emerald-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((place) => (
                        <button
                            key={place.place_id}
                            type="button"
                            onClick={() => handlePlaceSelect(place)}
                            className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-emerald-100 last:border-b-0"
                        >
                            <div className="font-semibold text-emerald-900">{place.name}</div>
                            {place.address && (
                                <div className="text-sm text-emerald-600">{place.address}</div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {selectedPlace && (
                <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-600">📍</span>
                        <div>
                            <div className="font-semibold text-emerald-900">{selectedPlace.name}</div>
                            {selectedPlace.address && (
                                <div className="text-sm text-emerald-600">{selectedPlace.address}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaceAutocomplete;
