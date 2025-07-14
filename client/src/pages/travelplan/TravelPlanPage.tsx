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

    const fetchPlans = () => {
        setLoading(true);
        setError(null);
        getAllTravelPlans()
            .then(setPlans)
            .catch(() => setError('Failed to load travel plans'))
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        fetchPlans();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-5xl font-bold text-emerald-900 mb-2">Travel Plan Hub</h2>
                            <p className="text-xl text-gray-600">Design and manage your perfect adventures</p>
                        </div>
                        <button
                            onClick={() => navigate(PATHS.TRAVEL_PLAN_CREATE)}
                            className="px-8 py-4 rounded-2xl bg-sky-600 text-white text-lg font-bold border-4 border-sky-700 shadow-lg hover:bg-sky-700 hover:border-sky-800 transform hover:scale-105 transition-all duration-300"
                        >
                            Create New Plan
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="bg-sky-50 border-2 border-sky-200 rounded-lg p-12 text-center">
                        <div className="text-sky-600 text-xl font-semibold">
                            Loading your travel plans...
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        <TravelPlanList plans={plans} />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="p-6 mb-8">
                        <div className="text-red-500 font-semibold text-center">{error}</div>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={fetchPlans}
                                className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-all"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TravelPlanPage;
