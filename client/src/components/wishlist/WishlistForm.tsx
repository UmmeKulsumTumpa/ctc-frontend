import React, { useState } from 'react';
import type { CreateWishlistRequestDto, UpdateWishlistRequestDto } from '../../types/wishlist.type';

type WishlistFormMode = 'create' | 'edit';

interface WishlistFormProps {
    initialValues?: Partial<CreateWishlistRequestDto | UpdateWishlistRequestDto>;
    onSubmit: (values: CreateWishlistRequestDto | UpdateWishlistRequestDto) => void;
    submitText?: string;
    mode?: WishlistFormMode;
    onBack?: () => void;
}

const defaultValues: CreateWishlistRequestDto = {
    place_id: '',
    name: '',
    region: '',
    theme: '',
    is_public: false,
};

const WishlistForm: React.FC<WishlistFormProps> = ({ initialValues = {}, onSubmit, submitText = 'Save', onBack }) => {
    const [form, setForm] = useState({ ...defaultValues, ...initialValues });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setForm((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((initialValues as any).place_id) {
            const { place_id, ...rest } = form;
            onSubmit(rest);
        } else {
            onSubmit(form);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow max-w-lg mx-auto border border-gray-200">
            {typeof onBack === 'function' && (
                <button type="button" onClick={onBack} className="mb-2 text-blue-700 hover:underline font-semibold w-fit">
                    ← Back
                </button>
            )}

            <input
                name="place_id"
                value={form.place_id}
                onChange={handleChange}
                placeholder="Place ID"
                required
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Wishlist Name"
                required
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
                name="region"
                value={form.region}
                onChange={handleChange}
                placeholder="Region"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
                name="theme"
                value={form.theme}
                onChange={handleChange}
                placeholder="Theme"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="flex items-center gap-2 text-gray-700">
                <input
                    type="checkbox"
                    name="is_public"
                    checked={!!form.is_public}
                    onChange={handleChange}
                    className="accent-blue-600"
                />
                Public
            </label>
            
            <button type="submit" className="bg-blue-700 text-white px-5 py-2 rounded-lg font-bold shadow hover:bg-blue-900 transition mt-2">
                {submitText}
            </button>
        </form>
    );
};

export default WishlistForm;
