import React, { useEffect, useState } from 'react';
import type { TravelPlan, PlanParticipant } from '../../types/travelPlan.type';
import { getPlanParticipants, getPlanComments, getPlannedPlaces, getPlanServices } from '../../services/travelPlan.service';

interface TravelPlanCardProps {
    plan: TravelPlan;
}

const TravelPlanCard: React.FC<TravelPlanCardProps> = ({ plan }) => {
    const [participants, setParticipants] = useState<PlanParticipant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getPlanParticipants(plan.plan_id),
            getPlanComments(plan.plan_id),
            getPlannedPlaces(plan.plan_id),
            getPlanServices(plan.plan_id)
        ])
            .then(([participants]) => {
                setParticipants(participants);
            })
            .catch(() => setError('Failed to load plan details'))
            .finally(() => setLoading(false));
    }, [plan.plan_id]);

    if (loading) {
        return (
            <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-8 text-center">
                <div className="text-emerald-600 text-lg font-bold animate-pulse">
                    Loading plan details...
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-red-50 border-2 border-red-200 shadow-lg rounded-xl p-8 text-center">
                <div className="text-red-700 text-lg font-bold">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-emerald-900 mb-2 group-hover:text-emerald-700 transition-colors">
                        {plan.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-bold border border-sky-200">
                            {plan.status || 'Draft'}
                        </span>
                        {plan.total_cost && (
                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200">
                                ${plan.total_cost}
                            </span>
                        )}
                        {plan.total_duration && (
                            <span className="bg-navy-100 text-navy-800 px-3 py-1 rounded-full text-sm font-bold border border-navy-200">
                                {plan.total_duration} days
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Date Range */}
            {(plan.start_date || plan.end_date) && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 mb-4">
                    <div className="text-sky-600 text-sm font-medium mb-1">Travel Dates</div>
                    <div className="text-sky-900 font-bold">
                        {plan.start_date || 'TBD'} → {plan.end_date || 'TBD'}
                    </div>
                </div>
            )}

            {/* Team Section */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">
                <div className="text-emerald-600 text-sm font-medium mb-2">Travel Team</div>
                {participants.length === 0 ? (
                    <div className="text-gray-500 text-sm italic">Solo adventure</div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {participants.slice(0, 3).map(p => (
                            <span key={p.user_id} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-semibold">
                                User {p.user_id} ({p.role_permission})
                            </span>
                        ))}
                        {participants.length > 3 && (
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-semibold">
                                +{participants.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
                <a 
                    href={`/travelplan/${plan.plan_id}`} 
                    className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all transform hover:scale-105"
                >
                    View Details
                </a>
            </div>
        </div>
    );
};

export default TravelPlanCard;
