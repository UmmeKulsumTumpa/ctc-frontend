import React from 'react';
import TravelPlanCreateForm from '../../components/travelplan/TravelPlanCreateForm';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../constants/path.constants';

const TravelPlanCreatePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Create Travel Plan</h2>
            <TravelPlanCreateForm onCreated={() => navigate(PATHS.TRAVEL_PLANS)} />
        </div>
    );
};

export default TravelPlanCreatePage;
