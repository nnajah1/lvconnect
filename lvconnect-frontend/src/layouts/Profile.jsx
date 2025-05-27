
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Settings, LogOut } from "lucide-react"

export function ProfileDropdown({ user, logout }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleProfileClick = () => {
    // Navigate to profile page
    console.log("Navigate to profile")
    setIsOpen(false)
  }

  const handleSettingsClick = () => {
    // Navigate to settings page
    console.log("Navigate to settings")
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center rounded p-1 hover:bg-blue-800"
        aria-label="User profile"
      >
        <div className="h-8 w-8 overflow-hidden rounded-full bg-white">
          <svg
            className="h-full w-full p-1 text-blue-900"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <ChevronDown className="ml-1 h-4 w-4 md:ml-2" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white text-gray-800 shadow-lg">
          <div className="border-b border-gray-200 px-4 py-3">
            <p className="font-medium">{user.first_name}</p>
            <p className="text-xs text-gray-500">{user.email || "user@example.com"}</p>
          </div>
          <div className="py-1">
            {/* <button
              onClick={handleProfileClick}
              className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100"
            >
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profile
            </button>
            <button
              onClick={handleSettingsClick}
              className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button> */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
