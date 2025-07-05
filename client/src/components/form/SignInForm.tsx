import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../constants/path.constants';

const SignInForm = () => {
	const { signIn, loading } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			await signIn(email, password);
			navigate(PATHS.DASHBOARD);
		} catch (err: any) {
			setError(err.message || 'Sign in failed');
		}
	};

	return (
		<div className="bg-white border-2 border-emerald-200 shadow-xl rounded-3xl p-10">
			<form onSubmit={handleSubmit} className="space-y-6">
				{error && (
					<div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-4 py-3 font-semibold">
						{error}
					</div>
				)}
				
				<div>
					<label className="block font-bold mb-2 text-emerald-900">
						Email Address
					</label>
					<input
						type="email"
						placeholder="your.email@example.com"
						value={email}
						onChange={e => setEmail(e.target.value)}
						className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
						required
					/>
				</div>
				
				<div>
					<label className="block font-bold mb-2 text-emerald-900">
						Password
					</label>
					<input
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
						required
					/>
				</div>
				
				<button 
					type="submit" 
					className="w-full mt-8 px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed" 
					disabled={loading}
				>
					{loading ? 'Signing you in...' : 'Sign In'}
				</button>
			</form>
		</div>
	);
};

export default SignInForm;
