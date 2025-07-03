import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlace } from '../services/place.service';
import type { PlaceDto } from '../types/place.type';

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
            const created = await createPlace(form);
            navigate('/places');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to create place.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Create New Place</h2>
            {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold mb-1">Name<span className="text-red-500">*</span></label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-semibold mb-1">Latitude<span className="text-red-500">*</span></label>
                        <input
                            name="latitude"
                            type="number"
                            value={form.latitude}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block font-semibold mb-1">Longitude<span className="text-red-500">*</span></label>
                        <input
                            name="longitude"
                            type="number"
                            value={form.longitude}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Address</label>
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Notes</label>
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-200 text-blue-900 font-semibold"
                        onClick={() => navigate('/places')}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                </div>

            </form>
            
        </div>
    );
};

export default PlaceCreatePage;
