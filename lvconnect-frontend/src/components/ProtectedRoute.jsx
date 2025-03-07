import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuthContext();

    if (loading) {
        return <p>Loading...</p>;  // Show loading until authentication check is complete
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
