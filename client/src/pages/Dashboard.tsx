import React, { useEffect, useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import UserProfile from '../components/dashboard/UserProfile';
import UpdateProfileForm from '../components/dashboard/UpdateProfileForm';
import ChangePasswordForm from '../components/dashboard/ChangePasswordForm';
import { getUser, updateUser, changePassword } from '../services/user.service';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types/user.type';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [current, setCurrent] = useState('profile');
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        if (!user?.user_id) return;
        setLoading(true);
        getUser(user.user_id)
            .then(setProfile)
            .finally(() => setLoading(false));
    }, [user]);

    const handleUpdate = async (data: any) => {
        if (!user?.user_id) return;
        setUpdateLoading(true);
        await updateUser(user.user_id, data);
        const updated = await getUser(user.user_id);
        setProfile(updated);
        setUpdateLoading(false);
        setCurrent('profile');
    };

    const handleChangePassword = async (data: any) => {
        if (!user?.user_id) return;
        setUpdateLoading(true);
        await changePassword(user.user_id, data);
        setUpdateLoading(false);
        setCurrent('profile');
    };

    return (
        <div className="flex min-h-[80vh]">
            <Sidebar current={current} onSelect={setCurrent} />
            <main className="flex-1 p-6">
                {loading || !profile ? (
                    <div>Loading...</div>
                ) : current === 'profile' ? (
                    <UserProfile user={profile} />
                ) : current === 'update' ? (
                    <UpdateProfileForm initial={profile} onSubmit={handleUpdate} loading={updateLoading} />
                ) : current === 'password' ? (
                    <ChangePasswordForm onSubmit={handleChangePassword} loading={updateLoading} />
                ) : null}
            </main>
        </div>
    );
};

export default Dashboard;
