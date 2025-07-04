import React, { useEffect, useState } from 'react';
import { getAllTravelPlans } from '../../services/travelPlan.service';
import type { TravelPlan } from '../../types/travelPlan.type';
import TravelPlanList from '../../components/travelplan/TravelPlanList';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../constants/path.constants';

const TravelPlanPage: React.FC = () => {
    const [plans, setPlans] = useState<TravelPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getAllTravelPlans()
            .then(setPlans)
            .catch(() => setError('Failed to load travel plans'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-800 tracking-tight">
                🗺️ Travel Plans
            </h2>

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => navigate(PATHS.TRAVEL_PLAN_CREATE)}
                    className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition flex-shrink-0"
                >
                    + Create Travel Plan
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-6">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
                    <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
                </div>
            ) : (
                <div className="space-y-6">
                    <TravelPlanList plans={plans} />
                </div>
            )}
        </div>
    );
};

export default TravelPlanPage;
