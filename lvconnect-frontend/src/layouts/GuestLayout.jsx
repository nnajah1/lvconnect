import { Loader2 } from "@/components/dynamic/loader";
import { useAuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { roleRedirectMap } from "@/utils/roleRedirectMap";

export default function GuestLayout() {
    const { user, loading } = useAuthContext();

    if (loading) {
        return <Loader2 />;
    }
    if (user) {
        const primaryRole = user?.active_role || user.roles?.[0]?.name;
        const redirectPath = roleRedirectMap[primaryRole];

        if (redirectPath) {
            return <Navigate to={redirectPath} replace />;
        }

        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <div >



            <main>
                <Outlet />
            </main>
        </div>



    )
}