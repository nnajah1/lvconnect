import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles = [] }) {
    const { user, loading } = useAuthContext();

    if (loading) {
        return <p>Loading...</p>;  // Show loading until authentication check is complete
    }

    // If user is not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user does not have the required role, redirect to unauthorized page
    if (!Array.isArray(user.roles) || 
    !user.roles.some(role => allowedRoles.includes(role.name))) {
        return <Navigate to="/dashboard" replace />;}

    return <Outlet />;
}
