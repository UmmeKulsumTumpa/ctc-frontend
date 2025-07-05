import React, { useState } from "react";
import type { CreateTravelPlanRequestDto } from "../../types/travelPlan.type";

interface TravelPlanFormProps {
    initialValues?: Partial<CreateTravelPlanRequestDto>;
    onSubmit: (values: CreateTravelPlanRequestDto) => void;
    submitLabel?: string;
}


const initialPlan: CreateTravelPlanRequestDto = {
    name: '',
    start_date: '',
    end_date: '',
    total_cost: undefined,
    total_duration: undefined,
    status: undefined
};

const TravelPlanForm: React.FC<TravelPlanFormProps> = ({ initialValues = {}, onSubmit, submitLabel = "Create" }) => {

    const [form, setForm] = useState<CreateTravelPlanRequestDto>({
        ...initialPlan,
        ...initialValues
    });
    const [error, setError] = useState<string | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "number" && value !== "" ? Number(value) : value
        }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || form.name.trim() === "") {
            setError("Name is required.");
            return;
        }
        setError(null);
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-6 py-4 font-semibold">
                    {error}
                </div>
            )}

            <div>
                <label className="block font-bold mb-2 text-blue-900 text-lg">
                    Plan Name <span className="text-red-500">*</span>
                </label>
                <input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter a name for your travel plan"
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-lg" 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-bold mb-2 text-blue-900">
                        Start Date
                    </label>
                    <input 
                        type="date" 
                        name="start_date" 
                        value={form.start_date || ''} 
                        onChange={handleChange} 
                        className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors" 
                    />
                </div>
                <div>
                    <label className="block font-bold mb-2 text-blue-900">
                        End Date
                    </label>
                    <input 
                        type="date" 
                        name="end_date" 
                        value={form.end_date || ''} 
                        onChange={handleChange} 
                        className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-bold mb-2 text-blue-900">
                        Total Budget ($)
                    </label>
                    <input 
                        type="number" 
                        name="total_cost" 
                        value={form.total_cost ?? ''} 
                        onChange={handleChange} 
                        placeholder="Estimated total cost"
                        className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors" 
                    />
                </div>
                <div>
                    <label className="block font-bold mb-2 text-blue-900">
                        Duration (days)
                    </label>
                    <input 
                        type="number" 
                        name="total_duration" 
                        value={form.total_duration ?? ''} 
                        onChange={handleChange} 
                        placeholder="How many days?"
                        className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors" 
                    />
                </div>
            </div>

            <div>
                <label className="block font-bold mb-2 text-blue-900">
                    Plan Status
                </label>
                <select 
                    name="status" 
                    value={form.status || ''} 
                    onChange={handleChange} 
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                >
                    <option value="">Select current status</option>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            
            <button 
                type="submit" 
                className="w-full mt-8 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-colors text-lg"
            >
                {submitLabel}
            </button>
        </form>
    );
};

export default TravelPlanForm;
