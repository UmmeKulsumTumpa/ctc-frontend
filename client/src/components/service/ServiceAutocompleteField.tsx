import React from 'react';
import ServiceAutocomplete from './ServiceAutocomplete';
import type { ServiceResponseDto } from '../../types/service.type';

interface ServiceAutocompleteFieldProps {
    value?: string;
    onChange: (serviceId: string, serviceObj?: ServiceResponseDto) => void;
    label?: string;
    required?: boolean;
}

const ServiceAutocompleteField: React.FC<ServiceAutocompleteFieldProps> = ({ value, onChange, label, required }) => {
    const [selected, setSelected] = React.useState<ServiceResponseDto | null>(null);

    React.useEffect(() => {
        if (!value) setSelected(null);
    }, [value]);

    return (
        <div>
            <ServiceAutocomplete
                label={label}
                onSelect={service => {
                    setSelected(service);
                    onChange(service.service_id, service);
                }}
            />
            {required && !selected && (
                <div className="text-red-500 text-xs mt-1">Service selection is required</div>
            )}
            {selected && (
                <div className="mt-2 text-emerald-800 text-sm font-semibold">
                    Selected: <span className="text-navy-900">{selected.name}</span> <span className="text-xs text-emerald-700">({selected.type})</span>
                </div>
            )}
        </div>
    );
};

export default ServiceAutocompleteField;
