import React, { useState } from 'react';
import type { ChangePasswordRequest } from '../../types/user.request.type';

interface ChangePasswordFormProps {
    onSubmit: (data: ChangePasswordRequest) => Promise<void>;
    loading?: boolean;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSubmit, loading }) => {
    const [form, setForm] = useState<ChangePasswordRequest>({
        oldPassword: '',
        newPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await onSubmit(form);
            setSuccess('Password changed successfully');
            setForm({ oldPassword: '', newPassword: '' });
        } catch (err: any) {
            setError(err.message || 'Password change failed');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow p-6 w-full max-w-lg mx-auto space-y-4"
        >
            <h3 className="text-xl font-bold text-blue-900">Change Password</h3>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}
            <input
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                placeholder="Old Password"
                className="w-full border p-2 rounded"
                type="password"
                required
            />
            <input
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full border p-2 rounded"
                type="password"
                required
            />
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                disabled={loading}
            >
                Change Password
            </button>
        </form>
    );
};

export default ChangePasswordForm;
