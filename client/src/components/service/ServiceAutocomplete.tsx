import React, { useState } from 'react';
import { getAllServices } from '../../services/service.service';
import type { ServiceResponseDto, ServiceType } from '../../types/service.type';

const SERVICE_TYPES: ServiceType[] = ['Hotel', 'Restaurant', 'Attraction', 'Transport'];

interface ServiceAutocompleteProps {
    onSelect: (service: ServiceResponseDto) => void;
    label?: string;
    initialType?: ServiceType;
    initialName?: string;
}

const ServiceAutocomplete: React.FC<ServiceAutocompleteProps> = ({ onSelect, label, initialType = '', initialName = '' }) => {
    const [type, setType] = useState<ServiceType | ''>(initialType as ServiceType | '');
    const [name, setName] = useState(initialName);
    const [results, setResults] = useState<ServiceResponseDto[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setShowMenu(false);
        try {
            const filters: any = {};
            if (type) filters.type = type;
            if (name) filters.name = name;
            const found = await getAllServices(filters);
            setResults(found);
            setShowMenu(true);
        } catch {
            setError('Failed to find services');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {label && <label className="block font-semibold text-emerald-900 mb-2">{label}</label>}
            <div className="flex gap-2 mb-2">
                <select
                    className="border-2 border-emerald-200 rounded-lg px-4 py-2 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 text-emerald-900"
                    value={type}
                    onChange={e => setType(e.target.value as ServiceType)}
                >
                    <option value="">Type</option>
                    {SERVICE_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <input
                    className="border-2 border-emerald-200 rounded-lg px-4 py-2 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 text-emerald-900"
                    placeholder="Service name..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-all"
                    onClick={handleSearch}
                    disabled={loading || !type || !name}
                >
                    {loading ? 'Searching...' : 'Find'}
                </button>
            </div>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            {showMenu && results.length > 0 && (
                <div className="border-2 border-emerald-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto z-10">
                    {results.map(service => (
                        <div
                            key={service.service_id}
                            className="px-4 py-2 cursor-pointer hover:bg-emerald-50 text-navy-900"
                            onClick={() => { onSelect(service); setShowMenu(false); }}
                        >
                            <span className="font-semibold">{service.name}</span> <span className="text-xs text-emerald-700">({service.type})</span>
                        </div>
                    ))}
                </div>
            )}
            {showMenu && results.length === 0 && (
                <div className="border-2 border-emerald-200 rounded-lg bg-white shadow-lg px-4 py-2 text-emerald-700">No matching services found.</div>
            )}
        </div>
    );
};

export default ServiceAutocomplete;
