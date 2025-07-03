import React, { useState } from 'react';
import { updateService, getServiceById } from '../../services/service.service';
import type { ServiceUpdateRequestDto, ServiceResponseDto, ServiceType } from '../../types/service.type';
import { useNavigate, useParams } from 'react-router-dom';

const SERVICE_TYPES: ServiceType[] = ['Hotel', 'Restaurant', 'Attraction', 'Transport'];

const ServiceEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState<ServiceUpdateRequestDto>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [fetched, setFetched] = useState(false);

    React.useEffect(() => {
        if (!id) return;
        getServiceById(id)
            .then((service: ServiceResponseDto) => {
                setForm({
                    name: service.name,
                    type: service.type,
                    latitude: service.latitude,
                    longitude: service.longitude,
                    address: service.address,
                    description: service.description,
                });
                setFetched(true);
            })
            .catch(() => setError('Failed to fetch service'));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await updateService(id, form);
            setSuccess(true);
            setTimeout(() => navigate('/services'), 1000);
        } catch (err) {
            setError('Failed to update service');
        } finally {
            setLoading(false);
        }
    };

    if (!fetched) return <div>Loading...</div>;

    return (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Edit Service</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-blue-900">Name:</label>
                    <input name="name" value={form.name || ''} onChange={handleChange} required className="border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-blue-900">Type:</label>
                    <select name="type" value={form.type || ''} onChange={handleChange} required className="border-2 border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300">
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
                    <input name="address" value={form.address || ''} onChange={handleChange} className="border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-blue-900">Description:</label>
                    <textarea name="description" value={form.description || ''} onChange={handleChange} className="border-2 border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 min-h-[80px]" />
                </div>
                <button type="submit" disabled={loading} className="mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-all text-base">{loading ? 'Updating...' : 'Update'}</button>
            </form>
            {error && <div className="text-red-500 mt-3 text-center font-semibold">{error}</div>}
            {success && <div className="text-green-600 mt-3 text-center font-semibold">Service updated successfully!</div>}
        </div>
    );
};

export default ServiceEditPage;
