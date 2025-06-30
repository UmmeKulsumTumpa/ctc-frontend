import NavBar from './sections/Navbar'
import { Header } from './sections/Header'
import { Footer } from './sections/Footer'
import './App.css'

function App() {

	return (
		<>
			<div className="min-h-screen flex flex-col">
				<NavBar />
				<Header />
				<div className="flex-1"></div>
				<Footer />
			</div>
		</>
	)
}

export default App
