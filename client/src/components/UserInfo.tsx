import { useAuth } from '../contexts/AuthContext';
import SignOutButton from './button/SignOutButton';

const UserInfo = () => {
    const { user, isAuthenticated } = useAuth();
    
    if (!isAuthenticated || !user) return null;
    return (
        <div className="flex items-center gap-2">
            <span className="font-medium">{user.username || user.email}</span>
            <SignOutButton />
        </div>
    );
};

export default UserInfo;
