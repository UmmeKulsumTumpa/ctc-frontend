import React, { useState } from 'react';
import { createService } from '../../services/service.service';
import type { ServiceCreateRequestDto, ServiceType } from '../../types/service.type';
import { useNavigate } from 'react-router-dom';
import TransportForm from '../../components/service/TransportForm';
import { useTransportForm } from '../../hooks/useTransportForm';

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
    const navigate = useNavigate();
    
    const { 
        transportData, 
        updateTransportData, 
        resetTransportData, 
        isTransportDataValid, 
        getTransportPayload 
    } = useTransportForm();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'latitude' || name === 'longitude') {
            setForm(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
        
        if (name === 'type' && value !== 'Transport') {
            resetTransportData();
        }
    };

    const handleTransportChange = updateTransportData;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const payload: Partial<ServiceCreateRequestDto> = {};
            if (form.name && form.name.trim() !== '') payload.name = form.name.trim();
            if (form.type) payload.type = form.type;
            if (form.latitude !== undefined && form.latitude !== null) payload.latitude = form.latitude;
            if (form.longitude !== undefined && form.longitude !== null) payload.longitude = form.longitude;
            if (form.address && form.address.trim() !== '') payload.address = form.address.trim();
            if (form.description && form.description.trim() !== '') payload.description = form.description.trim();

            if (form.type === 'Transport') {
                const transportPayload = getTransportPayload();
                if (transportPayload) {
                    payload.transport = transportPayload;
                }
            }

            if (!payload.name || !payload.type) {
                setError('Service name and type are required.');
                setLoading(false);
                return;
            }

            if (form.type === 'Transport' && !isTransportDataValid()) {
                setError('Transport mode is required for transport services.');
                setLoading(false);
                return;
            }

            await createService(payload as ServiceCreateRequestDto);
            setSuccess(true);
            setForm(initialState);
            resetTransportData();
            setTimeout(() => navigate('/services'), 1500);
        } catch (err) {
            setError('Failed to create service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold text-emerald-900 mb-2">Add Travel Service</h2>
                        <p className="text-xl text-gray-600">Share a helpful service with fellow travelers</p>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-lg px-6 py-4 mb-8 font-semibold">
                        Service added successfully!
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-lg px-6 py-4 mb-8 font-semibold">
                        {error}
                    </div>
                )}

                {/* Main Form Container */}
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-semibold text-blue-900 mb-2">Service Name *</label>
                            <input 
                                name="name" 
                                value={form.name} 
                                onChange={handleChange} 
                                required 
                                className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="Enter the service name..."
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-blue-900 mb-2">Service Type *</label>
                            <select 
                                name="type" 
                                value={form.type} 
                                onChange={handleChange} 
                                required 
                                className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                            >
                                {SERVICE_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
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
                                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder="e.g., 40.7128"
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
                                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder="e.g., -74.0060"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold text-blue-900 mb-2">Address</label>
                            <input 
                                name="address" 
                                value={form.address} 
                                onChange={handleChange} 
                                className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="Street address or location..."
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-blue-900 mb-2">Description</label>
                            <textarea 
                                name="description" 
                                value={form.description} 
                                onChange={handleChange} 
                                className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                rows={4}
                                placeholder="Tell travelers what makes this service special..."
                            />
                        </div>

                        <div className="flex justify-center pt-6">
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="px-8 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Adding Service...' : 'Add Service'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ServiceCreatePage;
