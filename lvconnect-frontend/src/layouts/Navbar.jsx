"use client"

import { Menu } from "lucide-react"
import { NotificationDropdown } from "./Notification"
import { ProfileDropdown } from "./Profile"

export function Navbar({ user, logout, onMobileMenuToggle }) {
  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-md transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Mobile Menu + Title */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded hover:bg-blue-800 lg:hidden"
            aria-label="Toggle Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="pl-4 flex flex-col leading-tight">
            <span className="text-gray-500 text-sm font-normal">Welcome,</span>
            <span className="text-blue-900 text-lg md:text-xl font-bold truncate max-w-xs sm:max-w-sm md:max-w-md">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.first_name || user?.last_name || "User"}
            </span>
          </div>

        </div>

        {/* Right: Dropdowns */}
        <div className="flex items-center sm:space-x-4 mt-2 sm:mt-0 flex-shrink-0">
          <NotificationDropdown />
          <ProfileDropdown user={user} logout={logout} />
        </div>
      </div>
    </header>
  );

}
