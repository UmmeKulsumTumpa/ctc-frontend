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
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}

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
            
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition">{submitLabel}</button>
        </form>
    );
};

export default TravelPlanForm;
