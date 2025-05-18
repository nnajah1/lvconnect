// src/components/settings/NotificationTab.jsx
import React from "react";
import "../student_styling/settings.css";

export default function NotificationTab({ notifications, handleToggle }) {
  const categories = [
    {
      key: "schoolUpdates",
      title: "School updates",
      desc: "Get in-app notifications for announcements and upcoming events.",
    },
    {
      key: "enrollmentUpdates",
      title: "Enrollment updates",
      desc: "Get in-app notifications when enrollment opens.",
    },
    {
      key: "gradesUpdates",
      title: "Grades updates",
      desc: "Get in-app notifications when your grades are posted.",
    },
  ];

  return (
    <div className="notification_tab_container">
      <div className="notification_tab_header">
        <h3 className="notification_tab_title">Notification</h3>
        <p className="notification_tab_description">
          Configure your notification preferences.
        </p>
      </div>

      <div className="notification_tab_list">
        {categories.map(({ key, title, desc }) => (
          <div key={key} className="notification_tab_item">
            <div className="notification_tab_item_content">
              <div className="notification_tab_text">
                <h4 className="notification_tab_item_title">{title}</h4>
                <p className="notification_tab_item_desc">{desc}</p>
              </div>
              <div className="notification_tab_switch_group">
                {["inApp", "email"].map((type) => (
                  <div key={type} className="notification_tab_switch">
                    <label className="notification_tab_toggle_wrapper">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications[key][type]}
                        onChange={() => handleToggle(key, type)}
                      />
                      <div className="notification_tab_toggle"></div>
                    </label>
                    <span className="notification_tab_switch_label">
                      {type.replace("inApp", "In-app")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
