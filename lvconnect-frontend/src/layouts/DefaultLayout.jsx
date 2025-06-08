
import { useAuthContext } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import preventBackNavigation from "@/utils/preventBackNavigation";
import OTPVerification from "@/pages/authentication/OTPVerification";
import MustChangePassword from "@/pages/authentication/MustChangePassword";
import { Loader2 } from "@/components/dynamic/loader";
import { useState } from "react";
import { Navbar } from "./Navbar";
import Sidebar from "./sidebar";

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
    <div className="flex h-screen overflow-hidden bg-muted">
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setSidebarExpanded}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex flex-1 flex-col transition-all duration-300 lg:ml-0">
        <Navbar
          user={user}
          logout={logout}
          isSidebarExpanded={isSidebarExpanded}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main
          className={`mx-auto overflow-auto p-20 px-4 pb-4 transition-all scrollbar-hide duration-300 md:px-6 md:pb-6 ${isSidebarExpanded ? "w-[80vw] lg:ml-64" : "w-[95vw] lg:ml-20"
            }`}
        >
          <Outlet />
        </main>

      </div>
    </div>
  )
}
