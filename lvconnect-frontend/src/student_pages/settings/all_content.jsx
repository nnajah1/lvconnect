
import { useState } from "react";
import PersonalInformationTab from './personal_information_tab';
import NotificationTab from './notification_tab';
import "../student_styling/settings.css"; 


export default function NotificationSettings() {
  const [activeTab, setActiveTab] = useState("Notification");

  const [notifications, setNotifications] = useState({
    schoolUpdates: { inApp: false, email: false },
    enrollmentUpdates: { inApp: false, email: false },
    gradesUpdates: { inApp: false, email: false },
  });

  const handleToggle = (category, type) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
  };

  return (
    <div className="settings_content_container">
      <div className="settings_content_inner">
        {/* Settings Header */}
        <div className="settings_content_header">
          <h2 className="settings_content_title">Settings</h2>
          <p className="settings_content_subtitle">
            Manage your account settings and set notification preferences.
          </p>
        </div>

        {/* Tabs */}
        <div className="settings_content_tabs">
          {["Personal Information", "Password", "Notification"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`settings_content_tab_button ${
                activeTab === tab
                  ? "settings_content_tab_active"
                  : "settings_content_tab_inactive"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="settings_content_tab_panel">
          {activeTab === "Personal Information" && <PersonalInformationTab />}
          {activeTab === "Password" && (
            <div>
              <h3 className="text-xl font-semibold text-[#212529]">Password</h3>
              <p className="text-sm text-[#686868]">
                KAYA NATIN TO GUYSS MAY AWA ANG DIOS.... no UI so far
              </p>
            </div>
          )}
          {activeTab === "Notification" && (
            <NotificationTab
              notifications={notifications}
              handleToggle={handleToggle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
