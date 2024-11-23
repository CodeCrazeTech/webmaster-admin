import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = () => {
    const { accessToken } = useAuth();
    const location = useLocation();
    return (
        accessToken 
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default PrivateRoute;