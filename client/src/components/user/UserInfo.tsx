import { useEffect, useState } from 'react';
import { getUser } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import SignOutButton from '../button/SignOutButton';

const UserInfo = () => {
    const { user, isAuthenticated } = useAuth();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if (user?.user_id) {
            getUser(user.user_id)
                .then(u => setUsername(u.username))
                .catch(() => setUsername(null));
        }
    }, [user]);
    if (!isAuthenticated || !user) return null;
    return (
        <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-900 px-3 py-2 rounded-lg font-bold shadow border border-blue-200">
                👤 {username || user.email}
            </div>
            <SignOutButton />
        </div>
    );
};

export default UserInfo;
