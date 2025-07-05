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
        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-6 max-w-2xl mx-auto">

            <div>
                <label className="block font-bold mb-2 text-blue-900 text-lg">
                    Place ID <span className="text-red-500">*</span>
                </label>
                <input
                    name="place_id"
                    value={form.place_id}
                    onChange={handleChange}
                    placeholder="Enter the place identifier"
                    required
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-lg"
                />
            </div>

            <div>
                <label className="block font-bold mb-2 text-emerald-900 text-lg">
                    Wishlist Collection Name <span className="text-red-500">*</span>
                </label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Give your wishlist a memorable name..."
                    required
                    className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors text-lg"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-bold mb-2 text-blue-900">
                        Region
                    </label>
                    <input
                        name="region"
                        value={form.region}
                        onChange={handleChange}
                        placeholder="Which region are you dreaming of?"
                        className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                    />
                </div>

                <div>
                    <label className="block font-bold mb-2 text-emerald-900">
                        Theme
                    </label>
                    <input
                        name="theme"
                        value={form.theme}
                        onChange={handleChange}
                        placeholder="Adventure, relaxation, culture..."
                        className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                    />
                </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <label className="flex items-center gap-3 text-blue-900 font-bold cursor-pointer">
                    <input
                        type="checkbox"
                        name="is_public"
                        checked={!!form.is_public}
                        onChange={handleChange}
                        className="w-5 h-5 accent-blue-600"
                    />
                    Make this dream collection public
                    <span className="text-sm text-blue-600 font-normal ml-2">(Others can discover and be inspired)</span>
                </label>
            </div>
            
            <button 
                type="submit" 
                className="w-full mt-8 px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-colors text-lg"
            >
                ✨ {submitText}
            </button>

            {typeof onBack === 'function' && (
                <div className="flex justify-center">
                    <button 
                        type="button" 
                        onClick={onBack} 
                        className="mb-4 px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-bold border-2 border-gray-300 hover:bg-gray-300 transition-all"
                    >
                     Back
                    </button>
                </div>
            )}
            
        </form>
    );
};

export default WishlistForm;
