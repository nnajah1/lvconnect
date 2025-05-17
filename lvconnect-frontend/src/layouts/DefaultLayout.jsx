import { useAuthContext } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import preventBackNavigation from "@/utils/preventBackNavigation";
import OTPVerification from "@/pages/authentication/OTPVerification";
import MustChangePassword from "@/pages/authentication/MustChangePassword";
import Sidebar from "./sidebar";
import { Loader2 } from "@/components/dynamic/loader";

export default function DefaultLayout() {
    preventBackNavigation(OTPVerification || MustChangePassword);

    const {user, loading, logout } = useAuthContext();

    if (loading) {
        return <Loader2 />;  // Show loading until authentication check is complete
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return (
        <div id="defaultLayout">
            <Sidebar />
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