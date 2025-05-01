import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "../navbar.css"; // Optional: for custom styles
import Dashboard from "./dashboard";

const Navbar = ({ user = {}, notifications = [] }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const notificationsRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unread = notifications.filter((n) => !n.read);
  const filteredNotifications =
    activeTab === "all" ? notifications : unread;

  return (
    <div className="welcome-banner-container">
      <div className="welcome-banner-content">
        <p className="welcome-text">
          Welcome, {user.name ?? "PSAS"}
        </p>
        <div className="welcome-icons">
          <div className="relative">
            <FaBell
              className="icon clickable"
              onClick={() => setShowNotifications((prev) => !prev)}
            />
            {unread.length > 0 && (
              <span className="notification-badge" />
            )}
          </div>
          <FaUserCircle className="icon" />
          {showNotifications && (
            <div
              ref={notificationsRef}
              className="notifications-dropdown"
            >
              <div className="dropdown-header">
                <h2 className="dropdown-title">Notifications</h2>
                <div className="tab-buttons">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`tab-button ${
                      activeTab === "all" ? "active" : ""
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("unread")}
                    className={`tab-button ${
                      activeTab === "unread" ? "active" : ""
                    }`}
                  >
                    Unread
                  </button>
                </div>
              </div>
              {filteredNotifications.length === 0 ? (
                <p className="empty-text">No notifications</p>
              ) : (
                <ul className="notifications-list">
                  {filteredNotifications.map((notif) => (
                    <li key={notif.id} className="notification-item">
                      {notif.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

       
      </div>
      <Dashboard/>
    </div>
  );
};

export default Navbar;
