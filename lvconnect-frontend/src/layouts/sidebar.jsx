import { useEffect, useState } from "react";
import logo from "@/assets/lv-logo.png";
import { RxTextAlignJustify } from "react-icons/rx";
import { useAuthContext } from "@/context/AuthContext";
import { roleMenus } from "@/config/roleMenus";


import { Link, useLocation } from "react-router-dom"
import { X } from "lucide-react"
import { toast } from "react-toastify";
import { switchRole } from "@/services/axios";
import { roleRedirectMap } from "@/utils/roleRedirectMap";
import { cn } from "@/lib/utils";

export function Sidebar({ isExpanded, setIsExpanded, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { user } = useAuthContext()
  const location = useLocation()

  // Get user role and set menu dynamically
  // const userRole = user?.roles?.[0]?.name || "student"
  const userRole = user?.active_role || user?.roles?.[0]?.name || "student"
  const menuItems = roleMenus[userRole] || []

  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    setIsMobileMenuOpen(false)
  }

 return (
  <>
    {/* Desktop Sidebar */}
    <div
      className={cn(
        "fixed top-0 left-0 z-30 hidden h-full bg-sidebar-foreground text-white transition-all duration-300 lg:block",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      <SidebarContent
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        menuItems={menuItems}
        location={location}
        onLinkClick={handleLinkClick}
        showCloseButton={false}
      />
    </div>

    {/* Mobile Sidebar */}
    <div
      className={cn(
        "fixed top-0 left-0 z-40 h-full w-64 bg-sidebar-foreground text-white transition-transform duration-300 lg:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <SidebarContent
        isExpanded={true}
        setIsExpanded={setIsExpanded}
        menuItems={menuItems}
        location={location}
        onLinkClick={handleLinkClick}
        showCloseButton={true}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  </>
);

}

function SidebarContent({ isExpanded, setIsExpanded, menuItems, location, onLinkClick, showCloseButton, onClose }) {
  const { user, refreshUser } = useAuthContext();
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedRole(user.active_role || user.roles?.[0]?.name);
    }
  }, [user]);

  const handleRoleChange = async (e) => {
    const role = e.target.value;
    setLoading(true);
    try {
      await switchRole(role);
      toast.success("Role switched successfully!");

      await refreshUser(); // Ensure this updates user.active_role

      // Redirect based on new role
      const redirectPath = roleRedirectMap[role] || "/";
      window.location.href = redirectPath;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to switch role.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-full flex-col p-4">
      {/* Header with toggle/close button */}
      <div className={`mb-4 flex ${isExpanded ? "justify-end" : "justify-center"}`}>
        {showCloseButton ? (
          <button onClick={onClose} className="text-white">
            <X size={21} />
          </button>
        ) : (
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-white">
            <RxTextAlignJustify size={21} />
          </button>
        )}
      </div>

      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center">
          <img src={logo || "/placeholder.svg"} alt="Logo" className="h-16 w-16" />
        </div>
        {isExpanded && (
          <h1 className="text-[25px] leading-[40px] text-white">
            <span className="font-extrabold text-[#36A9E1]">LV</span>
            <span className="text-[17px] font-extrabold leading-[24px]">Connect</span>
          </h1>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map(({ name, path, match, solidIcon, outlineIcon }) => {
            const isActive = location.pathname === path || location.pathname.startsWith(match + "/")
            const Icon = isActive ? solidIcon : outlineIcon

            return (
              <li key={name}>
                <Link
                  to={path}
                  onClick={onLinkClick}
                  className={`flex items-center rounded-md p-2 ${isExpanded ? "space-x-3" : "justify-center"
                    } ${isActive ? "bg-[#20C1FB]" : "hover:bg-white/10"}`}
                >
                  <Icon size={21} className="text-white" />
                  {isExpanded && <span>{name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {/* Role Switcher */}
      {user?.roles?.length > 1 && (
        <div className="mt-auto pt-4">
          <label className="block text-xs font-medium text-white mb-1">
            Switch Role for Alpha Testers:
          </label>
          <select
            className="w-full rounded-md bg-white/10 p-2 text-white"
            value={selectedRole}
            onChange={handleRoleChange}
            disabled={loading}
          >
            {user?.roles?.map((role) => (
              <option key={role.name} value={role.name} className="bg-secondary">
                {role.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}


export default Sidebar;
