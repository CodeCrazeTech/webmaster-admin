import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RedirectRoute = () => {
    const { accessToken } = useAuth();
    const location = useLocation();
    return (
        accessToken 
            ? <Navigate to="/" replace />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RedirectRoute;