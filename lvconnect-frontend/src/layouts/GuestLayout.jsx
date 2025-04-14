import { useAuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestLayout() {
    const { user, loading } = useAuthContext();

    if (loading) {
        return <p>Loading...</p>;
    }
    if (user) {
        const isStudent = user.roles?.some(role => role.name === 'student');
        if (isStudent) {
            return <Navigate to="/dashboard" replace />;
        } else {
            if (user.roles?.some(role => role.name === 'comms')) {
                return <Navigate to="/comms-admin" replace />;
            } else if (user.roles?.some(role => role.name === 'scadmin')) {
                return <Navigate to="/school-admin" replace />;
            } else if (user.roles?.some(role => role.name === 'psas')) {
                return <Navigate to="/psas-admin" replace />;
            } else {
                // Fallback if no known admin role
                return <Navigate to="/unauthorized" replace />;
            }
        }
    }

    return (
        <div >



            <main>
                <Outlet />
            </main>
        </div>



    )
}