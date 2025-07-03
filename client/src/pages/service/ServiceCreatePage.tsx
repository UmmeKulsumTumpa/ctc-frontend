import React, { useState } from 'react';
import { createService } from '../../services/service.service';
import type { ServiceCreateRequestDto, ServiceType } from '../../types/service.type';

const SERVICE_TYPES: ServiceType[] = ['Hotel', 'Restaurant', 'Attraction', 'Transport'];

const initialState: ServiceCreateRequestDto = {
    name: '',
    type: 'Hotel',
    latitude: undefined,
    longitude: undefined,
    address: '',
    description: '',
};

const ServiceCreatePage: React.FC = () => {
    const [form, setForm] = useState<ServiceCreateRequestDto>(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await createService(form);
            setSuccess(true);
            setForm(initialState);
        } catch (err) {
            setError('Failed to create service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Create Service</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-blue-900">Name:</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-blue-900">Type:</label>
                    <select name="type" value={form.type} onChange={handleChange} required className="border-2 border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300">
                        {SERVICE_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-blue-900">Latitude:</label>
                    <input name="latitude" type="number" value={form.latitude ?? ''} onChange={handleChange} className="border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-blue-900">Longitude:</label>
                    <input name="longitude" type="number" value={form.longitude ?? ''} onChange={handleChange} className="border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-blue-900">Address:</label>
                    <input name="address" value={form.address} onChange={handleChange} className="border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-blue-900">Description:</label>
                    <textarea name="description" value={form.description} onChange={handleChange} className="border-2 border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 min-h-[80px]" />
                </div>
                <button type="submit" disabled={loading} className="mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-all text-base">{loading ? 'Creating...' : 'Create'}</button>
            </form>
            {error && <div className="text-red-500 mt-3 text-center font-semibold">{error}</div>}
            {success && <div className="text-green-600 mt-3 text-center font-semibold">Service created successfully!</div>}
        </div>
    );
};

export default ServiceCreatePage;
