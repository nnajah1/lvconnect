import { useAuthContext } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import preventBackNavigation from "../utils/preventBackNavigation";
import OTPVerification from "@/pages/OTPVerification";
import MustChangePassword from "@/pages/MustChangePassword";

export default function DefaultLayout() {
    preventBackNavigation(OTPVerification || MustChangePassword);

    const {user, loading, logout } = useAuthContext();

    if (loading) {
        return <p>Loading...</p>;  // Show loading until authentication check is complete
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return (
        <div id="defaultLayout">
            <div className="content">
                <header>
                    <div>
                        {user.name}
                    </div>
                    <div>
                        <a href="#" onClick={logout}>logout</a>
                    </div>
                </header>

                <main>
                    <Outlet/>
                </main>
            </div>


        </div>
           
     
    )
}