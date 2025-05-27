"use client"

import { useState } from "react"
import { Bell, ChevronDown } from "lucide-react"
import NotificationsPanel from "../dasboards_components/notification"

const Navbar = ({ userName = "John Doe", userRole = "Student", userAvatar = null }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false)

  const toggleNotificationsPanel = () => {
    setIsNotificationsPanelOpen(!isNotificationsPanelOpen)
  }

  return (
    <div className="relative px-5 pt-5">
      <div className="flex justify-between items-center px-5 py-4 bg-[#1F3463] rounded-lg h-[80px]">
        {/* Welcome Text */}
        <div>
          <span className="text-white text-xl sm:text-2xl font-semibold font-poppins">
            Welcome, {userName}
          </span>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 relative">
          {/* Notification Bell */}
          <div className="relative cursor-pointer w-6 h-7" onClick={toggleNotificationsPanel}>
            <Bell color="#F8F9FA" />
            <div className="absolute w-2.5 h-2.5 top-0 left-3 bg-red-600 rounded-full" />
          </div>

          {/* Avatar + Dropdown */}
          <div className="flex items-center gap-1 relative cursor-pointer">
            <div
              className="w-[33px] h-[33px] rounded-full overflow-hidden"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={userAvatar || "/placeholder.svg?height=33&width=33"}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <ChevronDown color="#FFFFFF" size={16} />
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-[45px] right-0 bg-white rounded-md shadow-lg z-50 min-w-[150px]">
                <div className="text-gray-600 text-sm px-4 py-2">
                  Signed in as <strong>{userRole}</strong>
                </div>
                <hr className="my-1" />
                <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</a>
                <a href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</a>
                <hr className="my-1" />
                <a href="/logout" className="block px-4 py-2 text-red-600 hover:bg-gray-100">Sign out</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      {isNotificationsPanelOpen && (
          <NotificationsPanel onClose={() => setIsNotificationsPanelOpen(false)} />
      
      )}
    </div>
  )
}

export default Navbar
