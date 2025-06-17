
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
import { useMediaQuery } from "react-responsive";
import GlobalPreloader from "@/components/dynamic/preloader";

export default function DefaultLayout() {
  preventBackNavigation(OTPVerification || MustChangePassword)

  const { user, loading, logout } = useAuthContext()
  const isDesktopDevice = useMediaQuery({ query: "(min-width: 1024px)" });
  const [isSidebarExpanded, setSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(min-width: 1024px)").matches;
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarWidth = isSidebarExpanded ? 256 : 80;
  if (loading) {
    return <Loader2 />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen transition-colors dark:bg-slate-950">
      {/* Mobile Backdrop */}
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

      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{
          paddingLeft: isDesktopDevice ? `${sidebarWidth}px` : undefined,
        }}
      >
        <Navbar
          user={user}
          logout={logout}
          isSidebarExpanded={isSidebarExpanded}
          onMobileMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <main className="relative flex-1 overflow-y-auto p-6 h-[calc(100vh-60px)] scrollbar-hide">

          <GlobalPreloader />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
