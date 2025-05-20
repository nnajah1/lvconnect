
import { useAuthContext } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import preventBackNavigation from "@/utils/preventBackNavigation";
import OTPVerification from "@/pages/authentication/OTPVerification";
import MustChangePassword from "@/pages/authentication/MustChangePassword";
import Sidebar from "./sidebar";
import { Loader2 } from "@/components/dynamic/loader";
import { useState } from "react";
import Navbar from "./Navbar";

export default function DefaultLayout() {
    preventBackNavigation(OTPVerification || MustChangePassword);

    const { user, loading, logout } = useAuthContext();
    const [isSidebarExpanded, setSidebarExpanded] = useState(true);

    if (loading) {
        return <Loader2 />; 
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return (
        <div id="" className="flex h-screen overflow-hidden bg-muted">
            <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setSidebarExpanded} />
            
            <div
                className={`flex flex-1 flex-col transition-all duration-300 ${isSidebarExpanded ? "md:ml-64" : "md:ml-20 "}`}
            >
                <Navbar
                    user={user}
                    logout={logout}
                />
                <main className="flex-1 overflow-auto px-4 pb-4 md:px-6 md:pb-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}