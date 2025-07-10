import React, { useEffect, useState } from 'react';
import { getAllPlaces } from '../../services/place.service';
import type { PlaceDto, PlaceFilters } from '../../types/place.type';
import PlaceCard from '../../components/place/PlaceCard';
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

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-5xl font-bold text-emerald-900 mb-2">Travel Places Hub</h2>
                            <p className="text-xl text-gray-600">Discover breathtaking destinations around the globe</p>
                        </div>
                        <button
                            className="px-8 py-4 rounded-2xl bg-sky-600 text-white text-lg font-bold border-4 border-sky-700 shadow-lg hover:bg-sky-700 hover:border-sky-800 transform hover:scale-105 transition-all duration-300"
                            onClick={() => navigate('/places/create')}
                        >
                            Add New Place
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-6 mb-10">
                    <h3 className="text-xl font-semibold text-emerald-800 mb-6 text-center">Filter Places</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <input
                            className="border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                            placeholder="Place name..."
                            value={filterInputs.name || ''}
                            onChange={e => setFilterInputs(f => ({ ...f, name: e.target.value }))}
                        />

                        <input
                            className="border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                            placeholder="Location address..."
                            value={filterInputs.address || ''}
                            onChange={e => setFilterInputs(f => ({ ...f, address: e.target.value }))}
                        />

                        <input
                            className="border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                            placeholder="Notes..."
                            value={filterInputs.notes || ''}
                            onChange={e => setFilterInputs(f => ({ ...f, notes: e.target.value }))}
                        />

                        <input
                            className="border-2 border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            placeholder="Latitude"
                            type="number"
                            value={filterInputs.latitude || ''}
                            onChange={e => setFilterInputs(f => ({ ...f, latitude: e.target.value ? Number(e.target.value) : undefined }))}
                        />

                        <input
                            className="border-2 border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            placeholder="Longitude"
                            type="number"
                            value={filterInputs.longitude || ''}
                            onChange={e => setFilterInputs(f => ({ ...f, longitude: e.target.value ? Number(e.target.value) : undefined }))}
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 transition-all"
                            onClick={() => setFilters({ ...filterInputs })}
                        >
                            Search Places
                        </button>
                        <button
                            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow-md hover:bg-gray-300 transition-all"
                            onClick={() => { setFilters({}); setFilterInputs({}); }}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
                
                {/* Places Content - Remove outer container to avoid double framing */}
                <div className="w-full">
                    {loading ? (
                        <div className="text-center text-emerald-600 text-xl font-semibold py-8 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                            Loading amazing places...
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                            <div className="text-center text-red-700 text-lg font-semibold">{error}</div>
                        </div>
                    ) : places.length === 0 ? (
                        <div className="text-center py-12 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                            <div className="text-emerald-700 text-lg font-bold">No places found matching your criteria.</div>
                            <p className="text-emerald-600 mt-2">Try adjusting your filters or search terms.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {places.map(place => (
                                <PlaceCard key={place.place_id} place={place} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlacesPage;
