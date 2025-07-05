import { useAuth } from '../../contexts/AuthContext';

const SignOutButton = () => {
	const { signOut, loading } = useAuth();
	return (
		<button
			onClick={() => signOut()}
			className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-red-700 transition-colors"
			disabled={loading}
		>
			{loading ? '👋 Signing out...' : '👋 Sign Out'}
		</button>
	);
};

export default SignOutButton;
