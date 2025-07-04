import React, { useState } from 'react';
import type { CreateTravelPlanRequestDto, TravelPlan } from '../../types/travelPlan.type';
import TravelPlanPlacesForm from './TravelPlanPlacesForm';
import TravelPlanServicesForm from './TravelPlanServicesForm';
import TravelPlanParticipantsForm from './TravelPlanParticipantsForm';
import TravelPlanCommentsForm from './TravelPlanCommentsForm';
import { useTravelPlanSequentialSubmit } from './TravelPlanSequentialSubmit';
import type { TravelPlanSubmission } from './TravelPlanSequentialSubmit';

const initialPlan: CreateTravelPlanRequestDto = {
    name: '',
    start_date: '',
    end_date: '',
    total_cost: undefined,
    total_duration: undefined,
    status: undefined
};


const TravelPlanCreateForm: React.FC<{ onCreated?: (plan: TravelPlan) => void }> = ({ onCreated }) => {
    const [form, setForm] = useState<CreateTravelPlanRequestDto>(initialPlan);
    const [places, setPlaces] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [participants, setParticipants] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const { loading, error, detailedError, createdPlan, handleSequentialSubmit } = useTravelPlanSequentialSubmit(onCreated);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const onFormSubmit = (e: React.FormEvent) => {
        // e.preventDefault();
        const submission: TravelPlanSubmission = {
            plan: form,
            places,
            services,
            participants,
            comments
        };
        handleSequentialSubmit(submission);
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <form onSubmit={onFormSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Name<span className="text-red-500">*</span></label>
                    <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-semibold">Start Date</label>
                        <input type="date" name="start_date" value={form.start_date || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div className="flex-1">
                        <label className="block font-semibold">End Date</label>
                        <input type="date" name="end_date" value={form.end_date || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-semibold">Total Cost</label>
                        <input type="number" name="total_cost" value={form.total_cost ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div className="flex-1">
                        <label className="block font-semibold">Total Duration</label>
                        <input type="number" name="total_duration" value={form.total_duration ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    </div>
                </div>
                <div>
                    <label className="block font-semibold">Status</label>
                    <select name="status" value={form.status || ''} onChange={handleChange} className="w-full border rounded px-3 py-2">
                        <option value="">Select status</option>
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <TravelPlanPlacesForm places={places} setPlaces={setPlaces} />
                <TravelPlanServicesForm services={services} setServices={setServices} />
                <TravelPlanParticipantsForm participants={participants} setParticipants={setParticipants} />
                <TravelPlanCommentsForm comments={comments} setComments={setComments} />

                {error && <div className="text-red-600">{error}</div>}
                {detailedError && <div className="text-red-500 text-sm">{detailedError}</div>}

                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition">
                    {loading ? 'Creating...' : 'Create Travel Plan'}
                </button>


            </form>

            {createdPlan && (
                <div className="mt-6 text-green-700 font-semibold">Travel plan created successfully!</div>
            )}
        </div>
    );
};


export default TravelPlanCreateForm;
