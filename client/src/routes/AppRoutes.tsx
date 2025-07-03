import { Routes, Route } from "react-router-dom";
import { PATHS } from "../constants/path.constants";

import Home from '../pages/Home';
import Blogs from "../pages/Blog";
import BlogDetail from "../pages/BlogDetail";
import BlogCreate from "../pages/BlogCreate";
import BlogEdit from "../pages/BlogEdit";
import SignIn from "../pages/Signin";
import SignUp from "../pages/Signup";
import Dashboard from '../pages/Dashboard';
import ServiceListPage from '../pages/ServiceListPage';
import ServiceCreatePage from '../pages/ServiceCreatePage';
import ServiceEditPage from '../pages/ServiceEditPage';
import NearbyServicesPage from '../pages/NearbyServicesPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={PATHS.HOME} element={<Home />} />
            <Route path={PATHS.BLOGS} element={<Blogs />} />
            <Route path={PATHS.BLOG_CREATE} element={<BlogCreate />} />
            <Route path={PATHS.BLOG_EDIT} element={<BlogEdit />} />
            <Route path={PATHS.BLOG_DETAIL} element={<BlogDetail />} />
            <Route path={PATHS.SIGN_IN} element={<SignIn />} />
            <Route path={PATHS.SIGN_UP} element={<SignUp />} />
            <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
            <Route path={PATHS.SERVICES} element={<ServiceListPage />} />
            <Route path={PATHS.SERVICE_CREATE} element={<ServiceCreatePage />} />
            <Route path={PATHS.SERVICE_EDIT} element={<ServiceEditPage />} />
            <Route path={PATHS.SERVICES_NEARBY} element={<NearbyServicesPage />} />
        </Routes>
    );
}

export default AppRoutes;
