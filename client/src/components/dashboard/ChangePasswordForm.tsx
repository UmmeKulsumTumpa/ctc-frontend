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
            className="w-full max-w-2xl mx-auto"
        >
            {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-4 py-3 font-semibold mb-6">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 rounded-xl px-4 py-3 font-semibold mb-6">
                    {success}
                </div>
            )}
            
            <div className="space-y-6">
                <div>
                    <label className="block font-bold mb-2 text-sky-900">
                        Current Password
                    </label>
                    <input
                        name="oldPassword"
                        value={form.oldPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                        className="w-full border-2 border-sky-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-colors"
                        type="password"
                        required
                    />
                </div>
                
                <div>
                    <label className="block font-bold mb-2 text-sky-900">
                        New Password
                    </label>
                    <input
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        placeholder="Choose a strong new password"
                        className="w-full border-2 border-sky-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-colors"
                        type="password"
                        required
                    />
                    <p className="text-sky-600 text-sm mt-2">
                        Use a mix of letters, numbers, and symbols for security
                    </p>
                </div>
            </div>
            
            <button
                type="submit"
                className="w-full mt-8 px-8 py-4 rounded-xl bg-sky-600 text-white font-bold shadow-lg hover:bg-sky-700 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
            >
                {loading ? 'Updating Password...' : 'Change Password'}
            </button>
        </form>
    );
};

export default ChangePasswordForm;
