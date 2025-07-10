import { BrowserRouter } from 'react-router-dom'
import NavBar from './sections/Navbar'
import { Footer } from './sections/Footer'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import { WishlistProvider } from './contexts/WishlistContext';
import './App.css'

function App() {
	return (
		<AuthProvider>
			<WishlistProvider>
				<BrowserRouter>
					<NavBar />
					<div className="app-content">
						<AppRoutes />
					</div>
					<Footer />
				</BrowserRouter>
			</WishlistProvider>
		</AuthProvider>
	);
}

export default App
