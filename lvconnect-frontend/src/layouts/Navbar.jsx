"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User } from "lucide-react"

export default function Navbar({ user, logout}) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const notificationsRef = useRef(null)
  const profileRef = useRef(null)

  // Sample notifications - replace with your actual data
  const notifications = [
    { id: 1, message: "New message received", time: "5 min ago", isRead: false },
    { id: 2, message: "Your report is ready", time: "1 hour ago", isRead: false },
    { id: 3, message: "Meeting scheduled for tomorrow", time: "3 hours ago", isRead: true },
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
    if (isProfileOpen) setIsProfileOpen(false)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
    if (isNotificationsOpen) setIsNotificationsOpen(false)
  }

  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  return (
    <header className="sticky top-0 z-10 bg-secondary text-white shadow-md p-2 m-2 rounded">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left side - Title and menu toggle */}
        <div className="flex items-center">
          
          <h1 className="text-lg font-semibold md:text-xl"> {user.name}</h1>
        </div>

        {/* Right side - Search, notifications, and profile */}
        <div className="flex items-center space-x-1 md:space-x-4">
   
          {/* Notifications dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={toggleNotifications}
              className="relative rounded p-1.5 hover:bg-blue-800"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500"></span>}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-md bg-white text-gray-800 shadow-lg">
                <div className="border-b border-gray-200 px-4 py-2">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border-b border-gray-100 px-4 py-3 hover:bg-gray-50 ${
                          !notification.isRead ? "bg-blue-50" : ""
                        }`}
                      >
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-sm text-gray-500">No notifications</div>
                  )}
                </div>
                <div className="border-t border-gray-200 px-4 py-2 text-center">
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-800">Mark all as read</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfile}
              className="flex items-center rounded p-1 hover:bg-blue-800"
              aria-label="User profile"
            >
              <div className="h-8 w-8 overflow-hidden rounded-full bg-white">
                <User className="h-full w-full p-1 text-blue-900" />
              </div>
              <ChevronDown className="ml-1 h-4 w-4 md:ml-2" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white text-gray-800 shadow-lg">
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email || "user@example.com"}</p>
                </div>
                <div className="py-1">
                  <button className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </button>
                  <button className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
