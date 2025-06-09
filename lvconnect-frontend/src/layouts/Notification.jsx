
import { useState, useRef, useEffect } from "react"
import { Bell } from "lucide-react"
import { fetchNotifications } from "@/services/axios";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // const notifications = [
    // { id: 1, message: "New message received", time: "5 min ago", isRead: false },
    // { id: 2, message: "Your report is ready", time: "1 hour ago", isRead: false },
    // { id: 3, message: "Meeting scheduled for tomorrow", time: "3 hours ago", isRead: true },

  // ]
 const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.read_at).length

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

  const markAllAsRead = () => {
    // Implement mark all as read functionality
    console.log("Mark all notifications as read")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="relative rounded p-1.5 hover:bg-blue-800" aria-label="Notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500"></span>}
      </button>

      {isOpen && (
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
            <button onClick={markAllAsRead} className="text-xs font-medium text-blue-600 hover:text-blue-800">
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
