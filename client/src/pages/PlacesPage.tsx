import React, { useEffect, useState } from 'react';
import { getAllPlaces, deletePlace } from '../services/place.service';
import type { PlaceDto, PlaceFilters } from '../types/place.type';
import PlaceCard from '../components/cards/PlaceCard';
import { useNavigate } from 'react-router-dom';

const PlacesPage: React.FC = () => {
    const [places, setPlaces] = useState<PlaceDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<PlaceFilters>({});
    const [filterInputs, setFilterInputs] = useState<PlaceFilters>({});
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getAllPlaces(filters)
            .then(setPlaces)
            .catch(() => setError('Failed to load places'))
            .finally(() => setLoading(false));
    }, [filters]);

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!window.confirm('Delete this place?')) return;

        try {
            await deletePlace(id);
            setPlaces(prev => prev.filter(p => p.place_id !== id));
        } catch {
            setError('Failed to delete place');
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800 font-serif tracking-tight drop-shadow-lg">Places</h2>

            <div className="flex flex-wrap gap-3 mb-6 justify-center">
                <button
                    className="px-5 py-2 rounded-lg bg-blue-700 text-white font-bold shadow hover:bg-blue-900 transition mb-2"
                    onClick={() => navigate('/places/create')}
                >
                    + Create Place
                </button>

                <input
                    className="border rounded px-3 py-2"
                    placeholder="Name"
                    value={filterInputs.name || ''}
                    onChange={e => setFilterInputs(f => ({ ...f, name: e.target.value }))}
                />

                <input
                    className="border rounded px-3 py-2"
                    placeholder="Address"
                    value={filterInputs.address || ''}
                    onChange={e => setFilterInputs(f => ({ ...f, address: e.target.value }))}
                />

                <input
                    className="border rounded px-3 py-2"
                    placeholder="Notes"
                    value={filterInputs.notes || ''}
                    onChange={e => setFilterInputs(f => ({ ...f, notes: e.target.value }))}
                />

                <input
                    className="border rounded px-3 py-2"
                    placeholder="Latitude"
                    type="number"
                    value={filterInputs.latitude || ''}
                    onChange={e => setFilterInputs(f => ({ ...f, latitude: e.target.value ? Number(e.target.value) : undefined }))}
                />

                <input
                    className="border rounded px-3 py-2"
                    placeholder="Longitude"
                    type="number"
                    value={filterInputs.longitude || ''}
                    onChange={e => setFilterInputs(f => ({ ...f, longitude: e.target.value ? Number(e.target.value) : undefined }))}
                />

                <button
                    className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
                    onClick={() => setFilters({ ...filterInputs })}
                >
                    Apply
                </button>

                <button
                    className="px-4 py-2 rounded bg-gray-200 text-blue-900 font-semibold"
                    onClick={() => { setFilters({}); setFilterInputs({}); }}
                >
                    Clear
                </button>

            </div>
            
            {loading ? (
                <div>Loading places...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <ul>
                    {places.map(place => (
                        <li key={place.place_id} className="py-3">
                            <PlaceCard place={place} onDelete={handleDelete} showActions />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlacesPage;
