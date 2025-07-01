import { BrowserRouter } from 'react-router-dom'
import NavBar from './sections/Navbar'
import { Footer } from './sections/Footer'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {

	return (
		<>
			<BrowserRouter>
				<NavBar />
				<AppRoutes />
				<Footer />
			</BrowserRouter>
		</>
	);
}

export default App
