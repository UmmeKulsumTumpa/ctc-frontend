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
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800 font-serif tracking-tight drop-shadow-lg">
                Travel Plans
            </h2>
            <div className="flex justify-end mb-4">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition"
                    onClick={() => navigate(PATHS.TRAVEL_PLAN_CREATE)}
                >
                    + Create Travel Plan
                </button>
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {loading ? <div>Loading...</div> : <TravelPlanList plans={plans} />}
        </div>
    );
};

export default TravelPlanPage;
