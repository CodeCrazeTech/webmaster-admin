import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicRoute = () => {
    const { accessToken } = useAuth();
    return (
        !accessToken 
            ? <Outlet />
            : <Navigate to="/" replace />
    );
}

export default PublicRoute;
