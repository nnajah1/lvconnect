
import { useState, useRef, useEffect } from "react"
import { Bell } from "lucide-react"
import { markOneAsRead, markAllAsRead } from "@/services/axios";
import { loadNotifications } from "@/hooks/notification";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState([]);
  const [read, setRead] = useState([]);

  const unreadCount = unread.length;

  const handleClickNotif = async (id) => {
    try {
      await markOneAsRead(id);
      setUnread((prev) => prev.filter((n) => n.id !== id));
      setRead((prev) => [
        ...prev,
        ...unread.filter((n) => n.id === id),
      ]);
    } catch (err) {
      console.error("Mark one failed", err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      setRead((prev) => [...unread, ...prev]);
      setUnread([]);
    } catch (err) {
      console.error("Mark all failed", err);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      loadNotifications(setUnread, setRead, setNotifications);
    }, 10000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(interval);
      } else {
        loadNotifications(setUnread, setRead, setNotifications);
        interval = setInterval(() => {
          loadNotifications(setUnread, setRead, setNotifications);
        }, 10000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadNotifications(setUnread, setRead, setNotifications);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative rounded p-1.5 hover:bg-blue-100 text-secondary"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-md bg-white text-gray-800 shadow-lg z-50">
          <div className="border-b border-gray-200 px-4 py-2">
            <h3 className="font-medium">Notifications</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleClickNotif(notification.id)}
                  className={`cursor-pointer border-b border-gray-100 px-4 py-3 hover:bg-gray-50 ${
                    !notification.read_at ? "bg-blue-50" : ""
                  }`}
                >
                  <p className="text-sm">{notification.data.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                No notifications
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 px-4 py-2 text-center">
            <button
              onClick={handleMarkAll}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
