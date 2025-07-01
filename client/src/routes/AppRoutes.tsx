import { Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Blogs from "../pages/Blog";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
        </Routes>
    );
}

export default AppRoutes;
