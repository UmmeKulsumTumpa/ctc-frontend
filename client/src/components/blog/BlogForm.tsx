import React, { useState } from "react";
import type { BlogCreate, BlogUpdate } from "../../types/blog/blog.type";
import type { EffortLevel, Visibility } from "../../constants/blog.constants";

interface BlogFormProps<T = BlogCreate | BlogUpdate> {
    initialValues?: Partial<T>;
    onSubmit: (values: T) => void;
    submitLabel?: string;
    isEdit?: boolean;
}

const effortLevels: EffortLevel[] = ["Low", "Medium", "High"];
const visibilities: Visibility[] = ["Public", "Private", "Friends"];

const BlogForm = <T extends BlogCreate | BlogUpdate = BlogCreate | BlogUpdate>({ initialValues = {}, onSubmit, submitLabel = "Create" }: BlogFormProps<T>) => {
    type CategoryType = string[];
    interface FormState {
        title: string;
        total_cost?: number;
        total_duration?: number;
        effort_level?: EffortLevel;
        place_id?: string;
        categories: CategoryType;
        visibility: Visibility;
        description: string;
    }
    const [form, setForm] = useState<FormState>({
        title: initialValues.title || "",
        total_cost: initialValues.total_cost,
        total_duration: initialValues.total_duration,
        effort_level: initialValues.effort_level,
        place_id: initialValues.place_id,
        categories: (initialValues.categories as string[]) || [],
        visibility: initialValues.visibility || "Public",
        description: initialValues.description || "",
    });
    const [categoryInput, setCategoryInput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "number" && value !== "" ? Number(value) : value,
        }));
    };

    const handleCategoryAdd = () => {
        const cat = categoryInput.trim();
        if (cat && !form.categories.includes(cat)) {
            setForm((prev) => ({
                ...prev,
                categories: [...prev.categories, cat],
            }));
            setCategoryInput("");
        }
    };

    const handleCategoryRemove = (cat: string) => {
        setForm((prev) => ({
            ...prev,
            categories: prev.categories.filter((c) => c !== cat),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || form.title.trim() === "") {
            setError("Title is required.");
            return;
        }
        setError(null);

        const data: any = {
            ...form,
            place_id: form.place_id && form.place_id.trim() !== "" ? form.place_id : undefined,
            total_cost: form.total_cost !== undefined && form.total_cost !== null ? Number(form.total_cost) : undefined,
            total_duration: form.total_duration !== undefined && form.total_duration !== null ? Number(form.total_duration) : undefined,
            categories: form.categories,
        };
        onSubmit(data as T);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6 max-w-2xl mx-auto border border-blue-100">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div>
                <label htmlFor="title" className="block font-bold mb-1 text-[#1a237e]">Title <span className="text-red-500">*</span></label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={form.title as string}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="effort_level" className="block font-semibold mb-1 text-[#1a237e]">Effort Level</label>
                    <select
                        id="effort_level"
                        name="effort_level"
                        value={form.effort_level || ""}
                        onChange={handleChange}
                        className="w-full border-2 border-green-200 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                        <option value="">Select</option>
                        {effortLevels.map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="visibility" className="block font-semibold mb-1 text-[#1a237e]">Visibility</label>
                    <select
                        id="visibility"
                        name="visibility"
                        value={form.visibility || ""}
                        onChange={handleChange}
                        className="w-full border-2 border-blue-200 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        {visibilities.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="total_cost" className="block font-semibold mb-1 text-[#1a237e]">Total Cost</label>
                    <input
                        id="total_cost"
                        type="number"
                        name="total_cost"
                        value={form.total_cost ?? ""}
                        onChange={handleChange}
                        className="w-full border-2 border-green-200 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="total_duration" className="block font-semibold mb-1 text-[#1a237e]">Total Duration</label>
                    <input
                        id="total_duration"
                        type="number"
                        name="total_duration"
                        value={form.total_duration ?? ""}
                        onChange={handleChange}
                        className="w-full border-2 border-blue-200 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="place_id" className="block font-semibold mb-1 text-[#1a237e]">Place ID</label>
                <input
                    id="place_id"
                    type="text"
                    name="place_id"
                    value={form.place_id || ""}
                    onChange={handleChange}
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>
            <div>
                <label className="block font-semibold mb-1 text-[#1a237e]">Categories</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        className="flex-1 border-2 border-green-200 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                        placeholder="Add category"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleCategoryAdd();
                            }
                        }}
                    />
                    <button type="button" onClick={handleCategoryAdd} className="px-4 py-2 rounded-lg bg-blue-200 text-blue-900 text-xs font-bold shadow hover:bg-blue-300 transition">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(form.categories || []).map((cat) => (
                        <span key={cat} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1 border border-green-700">
                            {cat}
                            <button type="button" onClick={() => handleCategoryRemove(cat)} className="text-xs text-red-500 ml-1">&times;</button>
                        </span>
                    ))}
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block font-semibold mb-1 text-[#1a237e]">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description as string}
                    onChange={handleChange}
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 min-h-[80px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>
            <button type="submit" className="mt-2 px-6 py-2 rounded-lg bg-blue-400 text-white font-bold shadow-lg hover:bg-blue-500 transition-all text-base">{submitLabel}</button>
        </form>
    );
};

export default BlogForm;
