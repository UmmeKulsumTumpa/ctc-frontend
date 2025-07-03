import React, { useState } from 'react';
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
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 w-full max-w-lg mx-auto space-y-4">
            <h3 className="text-xl font-bold text-blue-900">Update Profile</h3>
            {error && <div className="text-red-500">{error}</div>}
            <input
                name="username"
                value={form.username || ''}
                onChange={handleChange}
                placeholder="Username"
                className="w-full border p-2 rounded"
            />
            <input
                name="email"
                value={form.email || ''}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border p-2 rounded"
                type="email"
            />
            <input
                name="first_name"
                value={form.first_name || ''}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full border p-2 rounded"
            />
            <input
                name="last_name"
                value={form.last_name || ''}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full border p-2 rounded"
            />
            <input
                name="age"
                value={form.age || ''}
                onChange={handleChange}
                placeholder="Age"
                className="w-full border p-2 rounded"
                type="number"
                min="0"
            />
            <input
                name="profile_picture"
                value={form.profile_picture || ''}
                onChange={handleChange}
                placeholder="Profile Picture URL"
                className="w-full border p-2 rounded"
            />
            <textarea
                name="bio"
                value={form.bio || ''}
                onChange={handleChange}
                placeholder="Bio"
                className="w-full border p-2 rounded"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                disabled={loading}
            >
                Update
            </button>
        </form>
    );
};

export default UpdateProfileForm;
