import React from 'react';
import type { Transport } from '../../types/service.type';

interface TransportCardProps {
    transport: Transport;
}

const TransportCard: React.FC<TransportCardProps> = ({ transport }) => {
    return (
        <div className="border-t-2 border-emerald-400 bg-emerald-50 p-6 rounded-b-2xl">
            <div id={`transport-details-${transport.service_id}`}> 
                <div className="text-emerald-800 font-semibold mb-4">Transport Details</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                        <div className="text-emerald-700 text-xs font-medium">Mode</div>
                        <div className="text-emerald-900 font-bold">{transport.mode}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                        <div className="text-emerald-700 text-xs font-medium">Operator</div>
                        <div className="text-emerald-900 font-bold">{transport.operator || 'N/A'}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                        <div className="text-emerald-700 text-xs font-medium">Transport Added</div>
                        <div className="text-emerald-900 font-bold">{new Date(transport.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportCard;
