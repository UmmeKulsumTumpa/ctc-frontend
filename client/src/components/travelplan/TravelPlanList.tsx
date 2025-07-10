import React from 'react';
import type { TravelPlan } from '../../types/travelPlan.type';
import TravelPlanCard from './TravelPlanCard';

interface TravelPlanListProps {
    plans: TravelPlan[];
}

const TravelPlanList: React.FC<TravelPlanListProps> = ({ plans }) => {
    if (!plans.length) {
        return (
            <div className="text-center py-16">
                <div className="text-emerald-600 text-2xl font-bold mb-4">No Travel Plans Yet</div>
                <div className="text-gray-600">Start planning your next journey!</div>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plans.map(plan => (
                <TravelPlanCard key={plan.plan_id} plan={plan} />
            ))}
        </div>
    );
};

export default TravelPlanList;
