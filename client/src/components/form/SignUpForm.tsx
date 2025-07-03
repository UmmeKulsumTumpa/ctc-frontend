
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../constants/path.constants';

const SignUpForm = () => {
	const { signUp, loading } = useAuth();
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			await signUp({ email, username, password });
			navigate(PATHS.DASHBOARD);
		} catch (err: any) {
			setError(err.message || 'Sign up failed');
		}
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 bg-white rounded shadow space-y-4">

			{error && <div className="text-red-500">{error}</div>}
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={e => setEmail(e.target.value)}
				className="w-full border p-2 rounded"
				required
			/>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
				className="w-full border p-2 rounded"
				required
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={e => setPassword(e.target.value)}
				className="w-full border p-2 rounded"
				required
			/>
			<button type="submit" className="w-full bg-green-600 text-white py-2 rounded" disabled={loading}>
				{loading ? 'Signing up...' : 'Sign Up'}
			</button>
		</form>
	);
};

export default SignUpForm;
