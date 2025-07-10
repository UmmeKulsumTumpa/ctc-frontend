import React from 'react';
import TravelPlanCreateForm from '../../components/travelplan/TravelPlanCreateForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATHS } from '../../constants/path.constants';

const TravelPlanCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prefill = location.state || {};
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto pt-8 pb-4 px-6">
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-8">
                    <h1 className="text-5xl font-bold text-emerald-900 mb-4 text-center">Create Travel Plan</h1>
                    <p className="text-xl text-gray-600 text-center">Plan your next journey with friends and family</p>
                </div>
            </div>
            <TravelPlanCreateForm onCreated={() => navigate(PATHS.TRAVEL_PLANS)} prefill={prefill} />
        </div>
    );
};

export default TravelPlanCreatePage;
