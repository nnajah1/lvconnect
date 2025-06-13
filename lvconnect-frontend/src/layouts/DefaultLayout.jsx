
import { useAuthContext } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import preventBackNavigation from "@/utils/preventBackNavigation";
import OTPVerification from "@/pages/authentication/OTPVerification";
import MustChangePassword from "@/pages/authentication/MustChangePassword";
import { Loader2 } from "@/components/dynamic/loader";
import { useState } from "react";
import { Navbar } from "./Navbar";
import Sidebar from "./sidebar";
import { cn } from "@/lib/utils";

export default function DefaultLayout() {
  preventBackNavigation(OTPVerification || MustChangePassword)

  const { user, loading, logout } = useAuthContext()
  const [isSidebarExpanded, setSidebarExpanded] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (loading) {
    return <Loader2 />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    // <div className="flex h-screen overflow-hidden bg-muted">
    <div className="min-h-screen bg-white transition-colors dark:bg-slate-950">

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setSidebarExpanded}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className={cn("transition-[margin] duration-300", isSidebarExpanded ? "md:ml-[240px]" : "md:ml-[70px]")}>
        <Navbar
          user={user}
          logout={logout}
          isSidebarExpanded={isSidebarExpanded}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6 scrollbar-hide">
          <Outlet />
        </div>

      </div>
    </div>
  )
}
