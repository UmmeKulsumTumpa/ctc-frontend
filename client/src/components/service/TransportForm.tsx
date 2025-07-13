import React from 'react';
import type { TransportMode } from '../../types/service.type';

const TRANSPORT_MODES: TransportMode[] = ['Flight', 'Car', 'Rental', 'Bus', 'Train', 'Boat'];

interface TransportFormData {
    mode: TransportMode | '';
    operator: string;
}

interface TransportFormProps {
    data: TransportFormData;
    onChange: (data: Partial<TransportFormData>) => void;
    className?: string;
}

const TransportForm: React.FC<TransportFormProps> = ({ data, onChange, className = '' }) => {
    const handleChange = (field: keyof TransportFormData, value: string) => {
        onChange({ [field]: value });
    };

    return (
        <div className={`bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 space-y-4 ${className}`}>
            <h3 className="text-lg font-bold text-emerald-900">Transport Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-semibold text-emerald-900 mb-2">
                        Transport Mode <span className="text-red-500">*</span>
                    </label>
                    <select 
                        value={data.mode} 
                        onChange={(e) => handleChange('mode', e.target.value)}
                        required 
                        className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                        <option value="">Select transport mode</option>
                        {TRANSPORT_MODES.map(mode => (
                            <option key={mode} value={mode}>{mode}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block font-semibold text-emerald-900 mb-2">Operator</label>
                    <input 
                        type="text"
                        value={data.operator} 
                        onChange={(e) => handleChange('operator', e.target.value)}
                        className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        placeholder="e.g., United Airlines, Uber, etc."
                    />
                </div>
            </div>
        </div>
    );
};

export default TransportForm;
