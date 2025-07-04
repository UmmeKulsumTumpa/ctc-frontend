import React from 'react';
import type { TravelPlan } from '../../types/travelPlan.type';
import TravelPlanCard from './TravelPlanCard';

interface TravelPlanListProps {
    plans: TravelPlan[];
}

const TravelPlanList: React.FC<TravelPlanListProps> = ({ plans }) => {
    if (!plans.length) return <div>No travel plans found.</div>;
    return (
        <div className="flex flex-col gap-4">
            {plans.map(plan => (
                <TravelPlanCard key={plan.plan_id} plan={plan} />
            ))}
        </div>
    );
};

export default TravelPlanList;
