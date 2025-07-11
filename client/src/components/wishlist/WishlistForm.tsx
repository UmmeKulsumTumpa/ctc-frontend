import React, { useState, useEffect } from 'react';
import type { CreateWishlistRequestDto, UpdateWishlistRequestDto } from '../../types/wishlist.type';
import PlaceAutocomplete from '../place/PlaceAutocomplete';
import type { PlaceDto } from '../../types/place.type';
// import { ActionIcons } from '../icons/actionIcons';
import { WishlistIcons } from '../icons/commonIcons';

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
    const [selectedPlace, setSelectedPlace] = useState<PlaceDto | null>(null);

    useEffect(() => {
        const placeId = (initialValues as any).place_id;
        if (placeId && !selectedPlace) {
            setSelectedPlace({ place_id: placeId, name: placeId } as PlaceDto);
        }
    }, [initialValues, selectedPlace]);

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

    const handlePlaceSelect = (place: PlaceDto | null) => {
        setSelectedPlace(place);
        setForm((prev) => ({
            ...prev,
            place_id: place?.place_id || '',
        }));
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
        <div className="bg-white p-8 max-w-2xl mx-auto rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <PlaceAutocomplete
                        selectedPlace={selectedPlace}
                        onPlaceSelect={handlePlaceSelect}
                        label="Travel Destination"
                        placeholder="Search for destination..."
                        required={true}
                        className="mb-4"
                    />
                </div>

                <div>
                    <label className="block text-base font-bold text-navy-900 mb-2">
                        Wishlist Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter wishlist name..."
                        required
                        className="w-full border-2 border-emerald-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-navy-900 text-lg font-semibold transition-colors"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-base font-bold text-navy-900 mb-2">Region</label>
                        <input
                            name="region"
                            value={form.region}
                            onChange={handleChange}
                            placeholder="Enter region..."
                            className="w-full border-2 border-emerald-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-navy-900 text-lg font-semibold transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-base font-bold text-navy-900 mb-2">Theme</label>
                        <input
                            name="theme"
                            value={form.theme}
                            onChange={handleChange}
                            placeholder="Enter theme..."
                            className="w-full border-2 border-emerald-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-navy-900 text-lg font-semibold transition-colors"
                        />
                    </div>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_public"
                            checked={!!form.is_public}
                            onChange={handleChange}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <span className="text-base font-semibold text-emerald-700">Make this wishlist public</span>
                        <span className="text-xs text-navy-500">(Others can discover and view)</span>
                    </label>
                </div>

                <div className="flex gap-4 pt-4">
                    {typeof onBack === 'function' && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex-1 flex items-center justify-center gap-2 px-0 py-3 border-2 border-red-700 text-white bg-red-500 hover:bg-red-700 rounded-xl font-bold text-lg shadow-sm transition-all duration-200"
                        >
                            <WishlistIcons.Cancel size={22} />
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 px-0 py-3 bg-emerald-600 text-white rounded-xl font-bold text-lg border-2 border-emerald-700 hover:bg-emerald-700 hover:border-emerald-800 shadow-sm transition-all duration-200"
                    >
                        <WishlistIcons.Create size={22} />
                        {submitText}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WishlistForm;
