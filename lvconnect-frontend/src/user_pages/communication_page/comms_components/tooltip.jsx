import { BsFillInfoCircleFill } from "react-icons/bs";
import "../comms_styling/tooltip.css"; 

const Tooltip = ({ notification, setNotification, adminApproval, setAdminApproval, selectedType }) => {
  const switches = [
    {
      label: "Notification",
      state: notification,
      setter: setNotification,
      tooltip: "Notify students when this post is published.",
    },
    selectedType === "Announcement" && {
      label: "Admin Approval",
      state: adminApproval,
      setter: setAdminApproval,
      tooltip: "This announcement will be published immediately.",
    },
  ].filter(Boolean);

  return (
    <div className="tooltip-container">
      {switches.map(({ label, state, setter, tooltip }, index) => (
        <div key={index} className="tooltip-item">
          <span className="tooltip-label">{label}</span>
          <div className="tooltip-icon-wrapper">
            <BsFillInfoCircleFill className="tooltip-icon" size={14} />
            <div
              className={`tooltip-content ${
                label === "Admin Approval"
                  ? "tooltip-left-admin"
                  : label === "Notification" && selectedType === "Event"
                  ? "tooltip-left-event"
                  : "tooltip-center"
              }`}
            >
              {tooltip}
              <div
                className={`tooltip-arrow ${
                  label === "Admin Approval"
                    ? "arrow-left-admin"
                    : label === "Notification" && selectedType === "Event"
                    ? "arrow-left-event"
                    : "arrow-default"
                }`}
              ></div>
            </div>
          </div>
          <label className="switch">
            <input type="checkbox" checked={state} onChange={() => setter(!state)} className="sr-only" />
            <div className="switch-toggle"></div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default Tooltip;
