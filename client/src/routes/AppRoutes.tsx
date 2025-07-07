import { Routes, Route } from "react-router-dom";
import { PATHS } from "../constants/path.constants";

import Home from '../pages/Home';
import Blogs from "../pages/blog/Blog";
import BlogDetail from "../pages/blog/BlogDetail";
import BlogCreatePage from "../pages/blog/BlogCreate";
import BlogEdit from "../pages/blog/BlogEdit";
import SignIn from "../pages/Signin";
import SignUp from "../pages/Signup";
import Dashboard from '../pages/Dashboard';
import ServiceListPage from '../pages/service/ServiceListPage';
import ServiceCreatePage from '../pages/service/ServiceCreatePage';
import ServiceEditPage from '../pages/service/ServiceEditPage';
import NearbyServicesPage from '../pages/service/NearbyServicesPage';
import PlacesPage from '../pages/place/PlacesPage';
import PlaceCreatePage from '../pages/place/PlaceCreatePage';
import WishlistPage from '../pages/wishlist/WishlistPage';
import SingleWishlistPage from '../pages/wishlist/SingleWishlistPage';
import TravelPlanPage from '../pages/travelplan/TravelPlanPage';
import TravelPlanCreatePage from '../pages/travelplan/TravelPlanCreatePage';
import TravelPlanDetails from '../pages/travelplan/TravelPlanDetails';
import TravelPlanEditPage from '../pages/travelplan/TravelPlanEditPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={PATHS.HOME} element={<Home />} />
            <Route path={PATHS.BLOGS} element={<Blogs />} />
            <Route path={PATHS.BLOG_CREATE} element={<BlogCreatePage />} />
            <Route path={PATHS.BLOG_EDIT} element={<BlogEdit />} />
            <Route path={PATHS.BLOG_DETAIL} element={<BlogDetail />} />
            <Route path={PATHS.SIGN_IN} element={<SignIn />} />
            <Route path={PATHS.SIGN_UP} element={<SignUp />} />
            <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
            <Route path={PATHS.SERVICES} element={<ServiceListPage />} />
            <Route path={PATHS.SERVICE_CREATE} element={<ServiceCreatePage />} />
            <Route path={PATHS.SERVICE_EDIT} element={<ServiceEditPage />} />
            <Route path={PATHS.SERVICES_NEARBY} element={<NearbyServicesPage />} />
            <Route path={PATHS.PLACES} element={<PlacesPage />} />
            <Route path={PATHS.PLACES_CREATE} element={<PlaceCreatePage />} />
            <Route path={PATHS.WISHLISTS} element={<WishlistPage />} />
            <Route path={PATHS.WISHLIST_SHARE} element={<SingleWishlistPage />} />
            <Route path={PATHS.TRAVEL_PLANS} element={<TravelPlanPage />} />
            <Route path={PATHS.TRAVEL_PLAN_DETAILS} element={<TravelPlanDetails />} />
            <Route path={PATHS.TRAVEL_PLAN_CREATE} element={<TravelPlanCreatePage />} />
            <Route path="/travelplan/:planId/edit" element={<TravelPlanEditPage />} />
        </Routes>
    );
}

export default AppRoutes;
