import { useAuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestLayout() {
    const { user, loading } = useAuthContext();

    if (loading) {
        return <p>Loading...</p>;
    }
    if (user) {
        const isStudent = user.roles?.some(role => role.name === 'student');

        // Redirect based on role
        if (isStudent) {
            return <Navigate to="/dashboard" replace />;
        } else {
            return <Navigate to="/admin" replace />;
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