

import { Menu } from "lucide-react"
import { NotificationDropdown } from "./Notification"
import { ProfileDropdown } from "./Profile"

export function Navbar({ user, logout, isSidebarExpanded, onMobileMenuToggle }) {
  return (
    <header
      className={` sticky top-0 z-10 bg-secondary p-2 text-white shadow-base transition-all duration-300 ${
        isSidebarExpanded ? "lg:ml-64" : "lg:ml-20"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left side - Mobile menu toggle and title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMobileMenuToggle}
            className="rounded p-1.5 hover:bg-blue-800 lg:hidden"
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold md:text-xl">Welcome, {user.first_name}</h1>
        </div>

        {/* Right side - Notifications and profile */}
        <div className="flex items-center space-x-1 md:space-x-4">
          <NotificationDropdown />
          <ProfileDropdown user={user} logout={logout} />
        </div>
      </div>
    </header>
  )
}