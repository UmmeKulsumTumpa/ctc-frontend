import { BrowserRouter } from 'react-router-dom'
import NavBar from './sections/Navbar'
import { Footer } from './sections/Footer'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import { WishlistProvider } from './contexts/WishlistContext';
import './App.css'

function App() {
	return (
		<AuthProvider>
			<AdminAuthProvider>
				<WishlistProvider>
					<BrowserRouter>
						<NavBar />
						<div className="app-content">
							<AppRoutes />
						</div>
						<Footer />
					</BrowserRouter>
				</WishlistProvider>
			</AdminAuthProvider>
		</AuthProvider>
	);
}

export default App
