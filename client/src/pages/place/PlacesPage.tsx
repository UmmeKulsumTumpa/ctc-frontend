import React, { useEffect, useState } from 'react';
import { getAllPlaces } from '../../services/place.service';
import type { PlaceDto, PlaceFilters } from '../../types/place.type';
import PlaceCard from '../../components/place/PlaceCard';
import { useNavigate } from 'react-router-dom';
import { WishlistIcons } from '../../components/icons/commonIcons';

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
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="text-5xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
                                    Travel Places Hub
                                </h2>
                                <p className="text-xl text-gray-600">Discover breathtaking destinations around the globe</p>
                            </div>
                        </div>
                        <button
                            className="px-8 py-4 rounded-2xl bg-sky-600 text-white text-lg font-bold border-4 border-sky-700 shadow-lg hover:bg-sky-700 hover:border-sky-800 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            onClick={() => navigate('/places/create')}
                        >
                            <WishlistIcons.Add size={28} className="mr-1" />
                            Create
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-6 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="sr-only">Place Name</label>
                            <input
                                className="w-full border-2 border-emerald-300 rounded-xl px-4 py-2 text-base focus:border-emerald-500 focus:outline-none bg-emerald-50 text-emerald-900"
                                placeholder="Place name"
                                value={filterInputs.name || ''}
                                onChange={e => setFilterInputs(f => ({ ...f, name: e.target.value }))}
                                aria-label="Place name"
                            />
                        </div>
                        <div>
                            <label className="sr-only">Address</label>
                            <input
                                className="w-full border-2 border-emerald-300 rounded-xl px-4 py-2 text-base focus:border-emerald-500 focus:outline-none bg-emerald-50 text-emerald-900"
                                placeholder="Address"
                                value={filterInputs.address || ''}
                                onChange={e => setFilterInputs(f => ({ ...f, address: e.target.value }))}
                                aria-label="Address"
                            />
                        </div>
                        <div>
                            <label className="sr-only">Notes</label>
                            <input
                                className="w-full border-2 border-emerald-300 rounded-xl px-4 py-2 text-base focus:border-emerald-500 focus:outline-none bg-emerald-50 text-emerald-900"
                                placeholder="Notes"
                                value={filterInputs.notes || ''}
                                onChange={e => setFilterInputs(f => ({ ...f, notes: e.target.value }))}
                                aria-label="Notes"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="sr-only">Latitude</label>
                            <input
                                className="w-full border-2 border-sky-300 rounded-xl px-4 py-2 text-base focus:border-sky-500 focus:outline-none bg-sky-50 text-sky-900"
                                placeholder="Latitude"
                                type="number"
                                value={filterInputs.latitude || ''}
                                onChange={e => setFilterInputs(f => ({ ...f, latitude: e.target.value ? Number(e.target.value) : undefined }))}
                                aria-label="Latitude"
                            />
                        </div>
                        <div>
                            <label className="sr-only">Longitude</label>
                            <input
                                className="w-full border-2 border-sky-300 rounded-xl px-4 py-2 text-base focus:border-sky-500 focus:outline-none bg-sky-50 text-sky-900"
                                placeholder="Longitude"
                                type="number"
                                value={filterInputs.longitude || ''}
                                onChange={e => setFilterInputs(f => ({ ...f, longitude: e.target.value ? Number(e.target.value) : undefined }))}
                                aria-label="Longitude"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="flex-1 flex items-center justify-center gap-2 px-0 py-2 bg-emerald-600 text-white font-bold border-2 border-emerald-700 rounded-xl shadow-lg hover:bg-emerald-700 hover:border-emerald-800 transition-all text-base"
                                onClick={() => setFilters({ ...filterInputs })}
                            >
                                <WishlistIcons.Create size={18} />
                                Search
                            </button>
                            <button
                                className="flex-1 flex items-center justify-center gap-2 px-0 py-2 bg-white text-emerald-700 font-bold border-2 border-emerald-300 rounded-xl shadow-lg hover:bg-emerald-50 hover:border-emerald-400 transition-all text-base"
                                onClick={() => { setFilters({}); setFilterInputs({}); }}
                            >
                                <WishlistIcons.Reset size={18} />
                                Reset
                            </button>
                        </div>
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
