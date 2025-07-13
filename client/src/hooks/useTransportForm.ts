import { useState, useCallback } from 'react';
import type { TransportMode } from '../types/service.type';

interface TransportFormData {
    mode: TransportMode | '';
    operator: string;
}

interface UseTransportFormProps {
    initialData?: Partial<TransportFormData>;
}

export const useTransportForm = ({ initialData = {} }: UseTransportFormProps = {}) => {
    const [transportData, setTransportData] = useState<TransportFormData>({
        mode: initialData.mode || '',
        operator: initialData.operator || ''
    });

    const updateTransportData = useCallback((data: Partial<TransportFormData>) => {
        setTransportData(prev => ({ ...prev, ...data }));
    }, []);

    const resetTransportData = useCallback(() => {
        setTransportData({ mode: '', operator: '' });
    }, []);

    const isTransportDataValid = useCallback((): boolean => {
        return transportData.mode !== '';
    }, [transportData.mode]);

    const getTransportPayload = useCallback(() => {
        if (!isTransportDataValid()) return undefined;
        
        return {
            service_id: '',
            mode: transportData.mode as TransportMode,
            operator: transportData.operator || undefined
        };
    }, [transportData, isTransportDataValid]);

    return {
        transportData,
        updateTransportData,
        resetTransportData,
        isTransportDataValid,
        getTransportPayload
    };
};
