
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlace } from '../../services/place.service';
import type { PlaceDto } from '../../types/place.type';
import { PlaceSearchModal, PlaceDisplayModal } from '../../components/common/modals';
import { WishlistIcons } from '../../components/icons/commonIcons';
import { ActionIcons } from '../../components/icons/actionIcons';
import { PlaceIcon } from '../../components/icons/TravelIcons';

const initialState: Omit<PlaceDto, 'place_id' | 'created_at'> = {
    name: '',
    latitude: 0,
    longitude: 0,
    address: '',
    notes: '',
};

const PlaceCreatePage: React.FC = () => {
    const [form, setForm] = useState(initialState);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showLocationPreview, setShowLocationPreview] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: name === 'latitude' || name === 'longitude' ? Number(value) : value }));
    };

    const handleLocationSelect = (location: { lat: number; lng: number; name: string; address: string }) => {
        setForm(f => ({
            ...f,
            latitude: location.lat,
            longitude: location.lng,
            name: location.name || f.name,
            address: location.address || f.address
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await createPlace(form);
            navigate('/places');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to create place.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="flex flex-col items-center bg-white border border-emerald-400 shadow-xl rounded-3xl p-8 mb-10">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-emerald-700 text-4xl"><PlaceIcon size={38} /></span>
                        <h2 className="text-4xl font-extrabold text-emerald-900 tracking-tight">Add New Place</h2>
                    </div>
                    <p className="text-lg text-gray-600">Share a beautiful destination with fellow travelers</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-3 mb-8 text-base font-medium flex items-center gap-2">
                        <span className="text-xl"><ActionIcons.Cancel /></span> {error}
                    </div>
                )}

                {/* Main Form Container */}
                <div className="bg-white border border-blue-200 shadow-lg rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-base font-semibold text-blue-900">
                                    <span className="text-blue-700"><PlaceIcon size={20} /></span>
                                    Place Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:border-emerald-500 focus:outline-none shadow-sm"
                                    placeholder="Enter the name of this amazing place..."
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-base font-semibold text-blue-900">
                                    <span className="text-blue-700"><WishlistIcons.Location /></span>
                                    Address
                                </label>
                                <input
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:border-emerald-500 focus:outline-none shadow-sm"
                                    placeholder="Street address or general location..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-base font-semibold text-blue-900">
                                    <span className="text-blue-700"><WishlistIcons.Globe /></span>
                                    Latitude <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="latitude"
                                    type="number"
                                    step="any"
                                    value={form.latitude}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:border-emerald-500 focus:outline-none shadow-sm"
                                    placeholder="e.g., 40.7128"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-base font-semibold text-blue-900">
                                    <span className="text-blue-700"><WishlistIcons.Globe /></span>
                                    Longitude <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="longitude"
                                    type="number"
                                    step="any"
                                    value={form.longitude}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:border-emerald-500 focus:outline-none shadow-sm"
                                    placeholder="e.g., -74.0060"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 text-base font-semibold text-blue-900">
                                <span className="text-blue-700"><WishlistIcons.Star /></span>
                                Travel Notes
                            </label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:border-emerald-500 focus:outline-none shadow-sm"
                                rows={4}
                                placeholder="Share what makes this place special, travel tips, or memorable experiences..."
                            />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-4 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowMap(true)}
                                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg border border-blue-700 shadow-sm hover:bg-blue-700 transition-all font-semibold text-base"
                            >
                                <span><ActionIcons.Map /></span> Search on Map
                            </button>
                            {(form.latitude !== 0 || form.longitude !== 0) && (
                                <button
                                    type="button"
                                    onClick={() => setShowLocationPreview(true)}
                                    className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg border border-emerald-700 shadow-sm hover:bg-emerald-700 transition-all font-semibold text-base"
                                >
                                    <span><WishlistIcons.Location /></span> View on Map
                                </button>
                            )}
                        </div>

                        {(form.latitude !== 0 || form.longitude !== 0) && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-2">
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-emerald-800 mb-1 flex items-center gap-1"><WishlistIcons.Location /> Selected Location</h4>
                                        <div className="text-sm space-y-1">
                                            <p><span className="font-medium">Coordinates:</span> {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}</p>
                                            {form.address && (
                                                <p><span className="font-medium">Address:</span> {form.address}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center gap-4 pt-8">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-red-600 text-white text-base font-bold border border-red-700 shadow-sm hover:bg-red-700 transition-all"
                                onClick={() => navigate('/places')}
                                disabled={loading}
                            >
                                <ActionIcons.Cancel /> Cancel
                            </button>

                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-emerald-600 text-white text-base font-bold border border-emerald-700 shadow-sm hover:bg-emerald-700 transition-all"
                                disabled={loading}
                            >
                                <ActionIcons.Confirm /> {loading ? 'Adding Place...' : 'Add Place'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Map Modal */}
                <PlaceSearchModal
                    isOpen={showMap}
                    onClose={() => setShowMap(false)}
                    onLocationConfirm={handleLocationSelect}
                    title="Select Location on Map"
                    description="Search for a place or click on the map to select a location. This will automatically fill in the coordinates, name, and address."
                    defaultCenter={[27.7172, 85.3240]}
                />

                {/* Location Preview Modal */}
                <PlaceDisplayModal
                    isOpen={showLocationPreview}
                    onClose={() => setShowLocationPreview(false)}
                    latitude={form.latitude}
                    longitude={form.longitude}
                    placeName={form.name}
                    address={form.address}
                    title="Preview Location"
                />
            </div>
        </div>
    );
};

export default PlaceCreatePage;
