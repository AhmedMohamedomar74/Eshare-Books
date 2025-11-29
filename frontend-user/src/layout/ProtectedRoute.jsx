import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem("accessToken") && localStorage.getItem("refreshToken");
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />; 
};

export default ProtectedRoute;