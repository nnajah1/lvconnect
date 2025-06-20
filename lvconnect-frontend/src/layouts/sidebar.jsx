import { useEffect, useState } from "react";
import logo from "@/assets/lv-logo.png";
import { RxTextAlignJustify } from "react-icons/rx";
import { useAuthContext } from "@/context/AuthContext";
import { roleMenus } from "@/config/roleMenus";


import { Link, useLocation } from "react-router-dom"
import { X } from 'lucide-react'
import { toast } from "react-toastify";
import { switchRole } from "@/services/axios";
import { roleRedirectMap } from "@/utils/roleRedirectMap";
import { cn } from "@/lib/utils";

export function Sidebar({ isExpanded, setIsExpanded, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { user } = useAuthContext()
  const location = useLocation()

  // Get user role and set menu dynamically
  const userRole = user?.roles?.[0]?.name || "student"
  // const userRole = user?.active_role || user?.roles?.[0]?.name || "student"
  // const menuItems = roleMenus[userRole] || []

  const menuItems = roleMenus.filter(menu => menu.roles.includes(userRole));

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

  const [openDropdown, setOpenDropdown] = useState(null);
  const strictMatchPaths = ["/my", "/system-admin", "/comms-admin", "/psas-admin", "/registrar", "/school-admin"];

  const isPathActive = (targetPath) => {
    if (strictMatchPaths.includes(targetPath)) {
      return location.pathname === targetPath;
    }

    return location.pathname === targetPath || location.pathname.startsWith(targetPath + "/");
  };


  // useEffect(() => {
  //   if (user) {
  //     setSelectedRole(user.active_role || user.roles?.[0]?.name);
  //   }
  // }, [user]);

  // const handleRoleChange = async (e) => {
  //   const role = e.target.value;
  //   setLoading(true);
  //   try {
  //     await switchRole(role);
  //     toast.success("Role switched successfully!");

  //     await refreshUser(); // Ensure this updates user.active_role

  //     // Redirect based on new role
  //     const redirectPath = roleRedirectMap[role] || "/";
  //     window.location.href = redirectPath;
  //   } catch (err) {
  //     toast.error(err.response?.data?.error || "Failed to switch role.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


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
      <nav className="flex-1 px-2 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            // 🔹 Handle Dropdown Menus
            if (item.dropdown) {
              const isAnyChildActive = item.dropdown.some((child) => isPathActive(child.path))
              const isOpen = openDropdown === item.name || isAnyChildActive

              const ParentIcon = isAnyChildActive ? item.solidIcon : item.outlineIcon

              return (
                <li key={item.name}>
                  {/* Parent link */}
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                    className={`w-full flex items-center rounded-lg p-3 transition-all duration-200 ease-in-out group ${isExpanded ? "space-x-3" : "justify-center"
                      } ${isAnyChildActive
                        ? "bg-[#1BA3D6] text-white "
                        : "hover:bg-white/10 hover:shadow-md hover:scale-[1.02] text-white/90 hover:text-white"
                      }`}
                  >
                    <ParentIcon
                      size={21}
                      className={`transition-transform duration-200 ${isOpen && isExpanded ? "rotate-3" : ""
                        } ${isAnyChildActive ? "text-white" : "text-white/90 group-hover:text-white"}`}
                    />
                    {isExpanded && (
                      <span className="font-medium text-sm tracking-wide flex-1 text-left">{item.name}</span>
                    )}
                    {isExpanded && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                          } ${isAnyChildActive ? "text-white" : "text-white/70"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {/* Dropdown children */}
                  {isOpen && isExpanded && (
                    <ul className="pl-4 mt-2 space-y-1 border-l-2 border-white/10 ml-4 animate-in slide-in-from-top-2 duration-200">
                      {item.dropdown.map((child) => {
                        const isActive = isPathActive(child.path)
                        const ChildIcon = isActive ? child.solidIcon : child.outlineIcon

                        return (
                          <li key={child.name}>
                            <Link
                              to={child.path}
                              onClick={onLinkClick}
                              className={`flex items-center rounded-lg p-2.5 space-x-3 transition-all duration-200 ease-in-out group relative ${isActive
                                ? "bg-gradient-to-r from-[#20C1FB] to-[#1BA3D6] text-white shadow-md shadow-[#20C1FB]/20 scale-[1.02]"
                                : "hover:bg-white/8 hover:shadow-sm hover:scale-[1.01] text-white/80 hover:text-white"
                                }`}
                            >
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>
                              )}
                              <ChildIcon
                                size={18}
                                className={`transition-colors duration-200 ${isActive ? "text-white" : "text-white/80 group-hover:text-white"
                                  }`}
                              />
                              <span className="font-medium text-sm tracking-wide">{child.name}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            }

            // 🔸 Handle Flat Menus
            const isActive = isPathActive(item.path)
            const Icon = isActive ? item.solidIcon : item.outlineIcon

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={onLinkClick}
                  className={`flex items-center rounded-lg p-3 transition-all duration-200 ease-in-out group relative ${isExpanded ? "space-x-3" : "justify-center"
                    } ${isActive
                      ? "bg-[#1BA3D6] text-white"
                      : "hover:bg-white/10 hover:shadow-md hover:scale-[1.02] text-white/90 hover:text-white"
                    }`}
                >
                  {/* {isActive && isExpanded && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}
                  <Icon
                    size={21}
                    className={`transition-colors duration-200 ${isActive ? "text-white" : "text-white/90 group-hover:text-white"
                      }`}
                  /> */}
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Icon
                      size={21}
                      className={`transition-colors duration-200
                      ${isActive ? "text-white" : "text-white/90 group-hover:text-white"}`}
                    />
                  </div>
                  {isExpanded && <span className="font-medium text-sm tracking-wide">{item.name}</span>}
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