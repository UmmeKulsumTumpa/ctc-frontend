import { useAuth } from '../../contexts/AuthContext';

const SignOutButton = () => {
	const { signOut, loading } = useAuth();
	return (
		<button
			onClick={() => signOut()}
			className="bg-red-600 text-white px-4 py-2 rounded"
			disabled={loading}
		>
			Sign Out
		</button>
	);
};

export default SignOutButton;
