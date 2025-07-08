import React, { useState } from 'react';
import { uploadToCloudinary } from '../../utils/cloudinary';
import type { UpdateUserRequest } from '../../types/user.request.type';
import type { User } from '../../types/user.type';

interface UpdateProfileFormProps {
    initial: User;
    onSubmit: (data: UpdateUserRequest) => Promise<void>;
    loading?: boolean;
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({ initial, onSubmit, loading }) => {
    const [form, setForm] = useState<UpdateUserRequest>({
        username: initial.username,
        email: initial.email,
        first_name: initial.first_name,
        last_name: initial.last_name,
        age: initial.age,
        profile_picture: initial.profile_picture,
        bio: initial.bio,
    });
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const url = await uploadToCloudinary(file);
            setForm(f => ({ ...f, profile_picture: url }));
        } catch (err) {
            setError('Image upload failed. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: name === 'age' ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await onSubmit(form);
        } catch (err: any) {
            setError(err.message || 'Update failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-4 py-3 font-semibold mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-bold mb-2 text-emerald-900">
                        Username
                    </label>
                    <input
                        name="username"
                        value={form.username || ''}
                        onChange={handleChange}
                        placeholder="Choose your traveler name..."
                        className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                    />
                </div>

                <div>
                    <label className="block font-bold mb-2 text-emerald-900">
                        Email Address
                    </label>
                    <input
                        name="email"
                        value={form.email || ''}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                        type="email"
                    />
                </div>

                <div>
                    <label className="block font-bold mb-2 text-emerald-900">
                        First Name
                    </label>
                    <input
                        name="first_name"
                        value={form.first_name || ''}
                        onChange={handleChange}
                        placeholder="Your first name"
                        className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                    />
                </div>

                <div>
                    <label className="block font-bold mb-2 text-emerald-900">
                        Last Name
                    </label>
                    <input
                        name="last_name"
                        value={form.last_name || ''}
                        onChange={handleChange}
                        placeholder="Your last name"
                        className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
                    />
                </div>

                <div>
                    <label className="block font-bold mb-2 text-sky-900">
                        Age
                    </label>
                    <input
                        name="age"
                        value={form.age || ''}
                        onChange={handleChange}
                        placeholder="Your age"
                        className="w-full border-2 border-sky-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-colors"
                        type="number"
                        min="0"
                    />
                </div>

                <div className="space-y-4">
                    <label className="block font-bold mb-2 text-emerald-900">Profile Picture</label>
                    
                    <div className="flex flex-col items-center gap-4">
                        <label className="cursor-pointer">
                            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl px-6 py-4 text-center hover:bg-emerald-100 transition-colors">
                                <div className="text-emerald-600 mb-2">
                                    👤
                                </div>
                                <span className="text-emerald-800 font-semibold">
                                    {uploading ? "Uploading..." : "Click to choose profile picture"}
                                </span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                        
                        {form.profile_picture && (
                            <div className="bg-white border-2 border-emerald-200 rounded-xl p-4 shadow-sm">
                                <img 
                                    src={form.profile_picture} 
                                    alt="Profile preview" 
                                    className="h-32 w-32 rounded-full object-cover border border-emerald-100" 
                                />
                                <p className="text-emerald-700 text-sm mt-2 text-center font-medium">Profile picture ready!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <label className="block font-bold mb-2 text-emerald-900">
                    Bio
                </label>
                <textarea
                    name="bio"
                    value={form.bio || ''}
                    onChange={handleChange}
                    placeholder="Tell fellow travelers about yourself, your travel style, and your adventures..."
                    rows={4}
                    className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors resize-none"
                />
            </div>

            <button
                type="submit"
                className="w-full mt-8 px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
            >
                {loading ? 'Updating Profile...' : 'Update Profile'}
            </button>
        </form>
    );
};

export default UpdateProfileForm;
