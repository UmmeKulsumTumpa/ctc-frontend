import { useState, useCallback, useEffect } from 'react';
import { getPlaceById } from '../services/place.service';
import type { PlaceDto } from '../types/place.type';
import type { PlannedPlace } from '../types/travelPlan.type';

interface UseTravelPlanPlaceSelectionOptions {
    initialPlaceData?: Partial<PlannedPlace>;
    onPlaceDataChange?: (placeData: Partial<PlannedPlace>) => void;
}

export const useTravelPlanPlaceSelection = (options: UseTravelPlanPlaceSelectionOptions = {}) => {
    const { initialPlaceData, onPlaceDataChange } = options;
    
    const [placeData, setPlaceData] = useState<Partial<PlannedPlace>>(initialPlaceData || {});
    const [selectedPlace, setSelectedPlace] = useState<PlaceDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load place by ID
    const loadPlace = useCallback(async (placeId: string) => {
        if (!placeId) return;

        setIsLoading(true);
        setError(null);
        try {
            const place = await getPlaceById(placeId);
            setSelectedPlace(place);
        } catch (err) {
            setError('Failed to load place data');
            console.error('Error loading place:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle place selection from autocomplete
    const handlePlaceSelect = useCallback((place: PlaceDto | null) => {
        setSelectedPlace(place);
        setError(null);
        
        const updatedPlaceData = {
            ...placeData,
            place_id: place?.place_id || ''
        };
        
        setPlaceData(updatedPlaceData);
        onPlaceDataChange?.(updatedPlaceData);
    }, [placeData, onPlaceDataChange]);

    // Handle other field changes (like priority)
    const handleFieldChange = useCallback((field: keyof PlannedPlace, value: any) => {
        const updatedPlaceData = {
            ...placeData,
            [field]: value
        };
        
        setPlaceData(updatedPlaceData);
        onPlaceDataChange?.(updatedPlaceData);
    }, [placeData, onPlaceDataChange]);

    // Initialize place data
    const initializePlaceData = useCallback((data: Partial<PlannedPlace>) => {
        setPlaceData(data);
        if (data.place_id && !selectedPlace) {
            loadPlace(data.place_id);
        }
    }, [loadPlace, selectedPlace]);

    // Get place ID
    const getPlaceId = useCallback(() => {
        return selectedPlace?.place_id || placeData.place_id || '';
    }, [selectedPlace, placeData.place_id]);

    // Validate place data
    const validatePlaceData = useCallback(() => {
        const isValid = !!(placeData.place_id && placeData.place_id.trim());
        return {
            isValid,
            errors: isValid ? [] : ['Place selection is required']
        };
    }, [placeData.place_id]);

    // Clear all data
    const clearPlaceData = useCallback(() => {
        setPlaceData({});
        setSelectedPlace(null);
        setError(null);
        onPlaceDataChange?.({});
    }, [onPlaceDataChange]);

    // Effect to sync with initial data
    useEffect(() => {
        if (initialPlaceData && initialPlaceData !== placeData) {
            initializePlaceData(initialPlaceData);
        }
    }, [initialPlaceData]);

    return {
        placeData,
        selectedPlace,
        isLoading,
        error,
        handlePlaceSelect,
        handleFieldChange,
        loadPlace,
        initializePlaceData,
        getPlaceId,
        validatePlaceData,
        clearPlaceData,
    };
};

export default useTravelPlanPlaceSelection;
