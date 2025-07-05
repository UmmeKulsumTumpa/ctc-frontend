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
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-6 max-w-4xl mx-auto border-2 border-blue-200">
            {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-4 py-3 font-semibold">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="title" className="block font-bold mb-2 text-blue-900 text-lg">
                    Story Title <span className="text-red-500">*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={form.title as string}
                    onChange={handleChange}
                    required
                    placeholder="Give your travel story a captivating title..."
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-lg"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="effort_level" className="block font-bold mb-2 text-emerald-900">
                        Difficulty Level
                    </label>
                    <select
                        id="effort_level"
                        name="effort_level"
                        value={form.effort_level || ""}
                        onChange={handleChange}
                        className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                    >
                        <option value="">Select difficulty level</option>
                        {effortLevels.map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="visibility" className="block font-bold mb-2 text-blue-900">
                        Story Visibility
                    </label>
                    <select
                        id="visibility"
                        name="visibility"
                        value={form.visibility || ""}
                        onChange={handleChange}
                        className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                    >
                        {visibilities.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="total_cost" className="block font-bold mb-2 text-emerald-900">
                        Total Budget ($)
                    </label>
                    <input
                        id="total_cost"
                        type="number"
                        name="total_cost"
                        value={form.total_cost ?? ""}
                        onChange={handleChange}
                        placeholder="How much did this adventure cost?"
                        className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                    />
                </div>

                <div>
                    <label htmlFor="total_duration" className="block font-bold mb-2 text-blue-900">
                        Duration (days)
                    </label>
                    <input
                        id="total_duration"
                        type="number"
                        name="total_duration"
                        value={form.total_duration ?? ""}
                        onChange={handleChange}
                        placeholder="How many days was this trip?"
                        className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="place_id" className="block font-bold mb-2 text-blue-900">
                    Destination (Place ID)
                </label>
                <input
                    id="place_id"
                    type="text"
                    name="place_id"
                    value={form.place_id || ""}
                    onChange={handleChange}
                    placeholder="Enter the place ID for your destination"
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                />
            </div>

            <div>
                <label className="block font-bold mb-2 text-emerald-900">
                    Travel Categories
                </label>
                <div className="flex gap-3 mb-3">
                    <input
                        type="text"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        className="flex-1 border-2 border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                        placeholder="Add tags like 'adventure', 'budget', 'luxury'..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleCategoryAdd();
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleCategoryAdd}
                        className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-colors"
                    >
                        Add Tag
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(form.categories || []).map((cat) => (
                        <span key={cat} className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full flex items-center gap-2 border border-emerald-300 font-semibold">
                            {cat}
                            <button
                                type="button"
                                onClick={() => handleCategoryRemove(cat)}
                                className="text-red-500 hover:text-red-700 font-bold text-lg"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="description" className="block font-bold mb-2 text-blue-900 text-lg">
                    Your Travel Story
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description as string}
                    onChange={handleChange}
                    placeholder="Share the details of your amazing journey. What made this trip special? What would you recommend to other travelers?"
                    rows={6}
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors resize-none"
                />
            </div>

            <button
                type="submit"
                className="mt-4 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-colors text-lg"
            >
                {submitLabel}
            </button>
        </form>
    );
};

export default BlogForm;
