"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, LogOut } from "lucide-react"

export function ProfileDropdown({ user, logout }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  
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

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2.5 px-1.5 py-1 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-fit"
        style={{ height: "49.1px" }}
        aria-label="User profile"
      >
        {/* Profile Image Section */}
        <div className="relative flex items-center justify-center" style={{ width: "33.1px", height: "43.1px" }}>
          <div
            className="rounded-full bg-gray-200 bg-cover bg-center"
            style={{
              width: "33.1px",
              height: "33.1px",
              backgroundImage: user?.avatar ? `url(${user.avatar})` : "none",
            }}
          >
            {!user?.avatar && (
              <svg
                className="h-full w-full p-1 text-gray-400"
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
            )}
          </div>

          {/* Chevron Down Icon */}
          <div
            className="absolute flex items-center justify-center bg-blue-900 border border-gray-100 rounded-full"
            style={{
              width: "16px",
              height: "16px",
              left: "18px",
              top: "26px",
              zIndex: 1,
            }}
          >
            <ChevronDown className="text-gray-100" style={{ width: "10px", height: "10px" }} />
          </div>
        </div>

        {/* Text Section */}
        <div
          className="flex flex-col items-start gap-0.5 flex-1 min-w-0"
          style={{ height: "43.1px", paddingTop: "5px" }}
        >
          <div
            className="text-black  truncate w-full"
            style={{
              fontFamily: "Lato, sans-serif",
              fontSize: "12px",
              lineHeight: "14px",
              fontWeight: 400,
              height: "14px",
            }}
          >
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.first_name || user?.last_name || "User"}
          </div>
          <div
            className="text-blue-800"
            style={{
              fontFamily: "Lato, sans-serif",
              fontSize: "10px",
              lineHeight: "12px",
              fontWeight: 400,
              height: "12px",
              color: "#08318B",
            }}
          >
            {/* Jah please insert this the role
            {user?.role || ""} */}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-fit rounded-md bg-white text-gray-800 shadow-lg border border-gray-200 z-50">
          <div className="border-b border-gray-200 px-4 py-3">
            <p className="font-medium">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.first_name || user?.last_name || "User"}
            </p>
            <p className="text-xs text-gray-500 overflow-hidden">{user?.email || "user@example.com"}</p>
          </div>
          <div className="py-1">
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
