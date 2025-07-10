import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const setupLeafletIcons = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

export const createCustomIcon = (color: string = 'blue') => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

export const DEFAULT_MAP_CENTER: [number, number] = [23.795397597978745, 90.26367187500001];
export const DEFAULT_MAP_ZOOM = 12;

export const reverseGeocode = async (lat: number, lng: number) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        const placeName = data.name || 
            data.display_name?.split(',')[0] || 
            data.address?.amenity || 
            data.address?.shop || 
            data.address?.tourism || 
            data.address?.building || 
            data.address?.house_number ? `${data.address.house_number} ${data.address.road}` : 
            data.address?.road || 
            data.address?.neighbourhood || 
            data.address?.suburb || 
            data.address?.city || 
            data.address?.town || 
            data.address?.village || 
            'Selected Location';
        
        return {
            name: placeName,
            address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            fullData: data
        };
    } catch (error) {
        console.error('Reverse geocoding failed:', error);
        return {
            name: 'Selected Location',
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            fullData: null
        };
    }
};

export const forwardGeocode = async (query: string) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return data.map((result: any) => ({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            name: result.display_name.split(',')[0] || result.name || 'Unknown Location',
            address: result.display_name || `${result.lat}, ${result.lon}`,
            fullData: result
        }));
    } catch (error) {
        console.error('Forward geocoding failed:', error);
        return [];
    }
};
