import React, { useState } from 'react';
import { getServiceById, updateService } from '../../services/service.service';
import type { ServiceUpdateRequestDto, ServiceType } from '../../types/service.type';
import { useNavigate, useParams } from 'react-router-dom';
import TransportForm from '../../components/service/TransportForm';
import { useTransportForm } from '../../hooks/useTransportForm';

const SERVICE_TYPES: ServiceType[] = ['Hotel', 'Restaurant', 'Attraction', 'Transport'];

const ServiceEditPage: React.FC = () => {
    const params = useParams();
    const id = params.serviceId ?? '';
    const navigate = useNavigate();
    const [form, setForm] = useState<ServiceUpdateRequestDto>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [fetched, setFetched] = useState(false);
    
    const { 
        transportData, 
        updateTransportData, 
        resetTransportData, 
        getTransportPayload 
    } = useTransportForm();

    React.useEffect(() => {
        if (!id) return;
        
        const fetchService = async () => {
            try {
                const service = await getServiceById(id);
                
                setForm({
                    name: service.name,
                    type: service.type,
                    latitude: service.latitude,
                    longitude: service.longitude,
                    address: service.address,
                    description: service.description,
                });
                
                if (service.transport) {
                    updateTransportData({
                        mode: service.transport.mode,
                        operator: service.transport.operator || ''
                    });
                }
                
                setFetched(true);
            } catch (err) {
                setError('Failed to fetch service');
            }
        };
        
        fetchService();
    }, [id, updateTransportData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        
        if (name === 'type' && value !== 'Transport') {
            resetTransportData();
        }
    };

    const handleTransportChange = updateTransportData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const payload: Partial<ServiceUpdateRequestDto> = {};
            if (form.name && form.name.trim() !== '') payload.name = form.name.trim();
            if (form.type) payload.type = form.type;
            if (form.latitude !== undefined && form.latitude !== null) payload.latitude = Number(form.latitude);
            if (form.longitude !== undefined && form.longitude !== null) payload.longitude = Number(form.longitude);
            if (form.address && form.address.trim() !== '') payload.address = form.address.trim();
            if (form.description && form.description.trim() !== '') payload.description = form.description.trim();

            if (form.type === 'Transport') {
                const transportPayload = getTransportPayload();
                if (transportPayload) {
                    payload.transport = {
                        mode: transportPayload.mode,
                        operator: transportPayload.operator
                    };
                }
            }

            await updateService(id, payload as ServiceUpdateRequestDto);
            setSuccess(true);
            setTimeout(() => navigate('/services'), 1000);
        } catch (err) {
            setError('Failed to update service');
        } finally {
            setLoading(false);
        }
    };

    if (!fetched) return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center text-blue-600 text-xl font-semibold">
                    Loading service details...
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl p-8">
                    <h2 className="text-5xl font-bold text-blue-900 mb-2 text-center">Update Travel Service</h2>
                    <p className="text-xl text-gray-600 text-center mb-8">Make changes to keep your service information fresh and accurate</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-semibold text-blue-900 mb-2">Service Name</label>
                                <input 
                                    name="name" 
                                    value={form.name || ''} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    placeholder="Enter service name"
                                />
                            </div>
                            
                            <div>
                                <label className="block font-semibold text-blue-900 mb-2">Service Type</label>
                                <select 
                                    name="type" 
                                    value={form.type || ''} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                >
                                    <option value="">Select a type</option>
                                    {SERVICE_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {form.type === 'Transport' && (
                            <TransportForm 
                                data={transportData} 
                                onChange={handleTransportChange} 
                            />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-semibold text-blue-900 mb-2">Latitude</label>
                                <input 
                                    name="latitude" 
                                    type="number" 
                                    step="any"
                                    value={form.latitude ?? ''} 
                                    onChange={handleChange} 
                                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    placeholder="e.g., 23.8103"
                                />
                            </div>
                            
                            <div>
                                <label className="block font-semibold text-blue-900 mb-2">Longitude</label>
                                <input 
                                    name="longitude" 
                                    type="number" 
                                    step="any"
                                    value={form.longitude ?? ''} 
                                    onChange={handleChange} 
                                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    placeholder="e.g., 90.4125"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold text-blue-900 mb-2">Address</label>
                            <input 
                                name="address" 
                                value={form.address || ''} 
                                onChange={handleChange} 
                                className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                placeholder="Enter full address"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-blue-900 mb-2">Description</label>
                            <textarea 
                                name="description" 
                                value={form.description || ''} 
                                onChange={handleChange} 
                                rows={4}
                                className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                placeholder="Share what makes this service special..."
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Updating Service...' : 'Update Service'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate('/services')}
                                className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow-md hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                            <div className="text-red-700 font-semibold text-center">{error}</div>
                        </div>
                    )}
                    {success && (
                        <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                            <div className="text-emerald-700 font-semibold text-center">Service updated successfully! Redirecting...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceEditPage;
