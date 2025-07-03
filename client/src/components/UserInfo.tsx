import { useEffect, useState } from 'react';
import { getUser } from '../services/user.service';
import { useAuth } from '../contexts/AuthContext';
import SignOutButton from './button/SignOutButton';

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
        <div className="flex items-center gap-2">
            <span className="font-medium">{username || user.email}</span>
            <SignOutButton />
        </div>
    );
};

export default UserInfo;
