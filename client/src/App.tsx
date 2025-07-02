import { BrowserRouter } from 'react-router-dom'
import NavBar from './sections/Navbar'
import { Footer } from './sections/Footer'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<NavBar />
				<div className="app-content">
					<AppRoutes />
				</div>
				<Footer />
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App
