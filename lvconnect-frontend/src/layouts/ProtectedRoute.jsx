"use client"
import { Navigate, Outlet, useLocation, useMatches } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { roleRedirectMap } from "@/utils/roleRedirectMap";

export default function ProtectedRoute() {
    const { user, loading } = useAuthContext();
    const location = useLocation();
    const matches = useMatches();

    if (loading) {
        return <p>Loading...</p>;  // Show loading until authentication check is complete
    }

    // If user is not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

   if (location.pathname === "/") {
    const primaryRole = user.roles?.[0]?.name;
    const redirectPath = roleRedirectMap[primaryRole];
    if (redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  const handle = matches.find((m) => m.handle?.roles)?.handle;
  const allowedRoles = handle?.roles || [];

  const hasAccess =
    allowedRoles.length === 0 ||
    user.roles.some((role) => allowedRoles.includes(role.name));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

    return <Outlet />;
}
