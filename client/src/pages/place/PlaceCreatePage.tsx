import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlace } from '../../services/place.service';
import type { PlaceDto } from '../../types/place.type';

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
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: name === 'latitude' || name === 'longitude' ? Number(value) : value }));
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
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold text-emerald-900 mb-2">Add New Place</h2>
                        <p className="text-xl text-gray-600">Share a beautiful destination with fellow travelers</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl px-6 py-4 mb-8 text-lg font-medium">
                        ❌ {error}
                    </div>
                )}

                {/* Main Form Container */}
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-lg font-bold text-blue-900 mb-2">
                                Place Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none shadow-sm"
                                placeholder="Enter the name of this amazing place..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-lg font-bold text-blue-900 mb-2">
                                    Latitude <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="latitude"
                                    type="number"
                                    step="any"
                                    value={form.latitude}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none shadow-sm"
                                    placeholder="e.g., 40.7128"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-bold text-blue-900 mb-2">
                                    Longitude <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="longitude"
                                    type="number"
                                    step="any"
                                    value={form.longitude}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none shadow-sm"
                                    placeholder="e.g., -74.0060"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-bold text-blue-900 mb-2">Address</label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none shadow-sm"
                                placeholder="Street address or general location..."
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-bold text-blue-900 mb-2">Travel Notes</label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none shadow-sm"
                                rows={4}
                                placeholder="Share what makes this place special, travel tips, or memorable experiences..."
                            />
                        </div>

                        <div className="flex justify-center gap-4 pt-6">
                            <button
                                type="button"
                                className="px-8 py-4 rounded-xl bg-gray-200 text-gray-800 text-lg font-bold border-2 border-gray-300 shadow-sm hover:bg-gray-300 transition-all"
                                onClick={() => navigate('/places')}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="px-8 py-4 rounded-xl bg-emerald-600 text-white text-lg font-bold border-2 border-emerald-700 shadow-sm hover:bg-emerald-700 transition-all"
                                disabled={loading}
                            >
                                {loading ? 'Adding Place...' : 'Add Place'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlaceCreatePage;
