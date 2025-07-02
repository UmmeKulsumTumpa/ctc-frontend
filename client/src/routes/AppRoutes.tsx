import { Routes, Route } from "react-router-dom";
import { PATHS } from "../constants/path.constants";
import Home from '../pages/Home';
import Blogs from "../pages/Blog";
import BlogDetail from "../pages/BlogDetail";
import SignIn from "../pages/Signin";
import SignUp from "../pages/Signup";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={PATHS.HOME} element={<Home />} />
            <Route path={PATHS.BLOGS} element={<Blogs />} />
            <Route path={PATHS.BLOG_DETAIL} element={<BlogDetail />} />
            <Route path={PATHS.SIGN_IN} element={<SignIn />} />
            <Route path={PATHS.SIGN_UP} element={<SignUp />} />
        </Routes>
    );
}

export default AppRoutes;
