import React from "react";
import { FaFacebook } from "react-icons/fa";
import "../comms_styling/fbsync.css";

const FacebookSync = ({ syncApalit, setSyncApalit, syncHigherEd, setSyncHigherEd }) => {
  return (
    <div className="fbsync-container">
      <div className="fbsync-header">
        <FaFacebook size={24} />
        <span>Sync to Facebook</span>
      </div>
      <p className="fbsync-description">Sync your update to LVCC’s Official Facebook pages:</p>
      <hr className="fbsync-divider" />

      {/* LVCC */}
      <div className="fbsync-checkbox-container">
        {[{
          label: "La Verdad Christian College, Inc. - Apalit, Pampanga",
          state: syncApalit,
          setter: setSyncApalit
        }, {
          label: "La Verdad Christian College, Inc. - Higher Education",
          state: syncHigherEd,
          setter: setSyncHigherEd
        }].map(({ label, state, setter }, index) => (
          <div key={index} className="fbsync-checkbox-item">
            <div className="fbsync-checkbox-label">
              <label className="fbsync-checkbox-switch">
                <input type="checkbox" checked={state} onChange={() => setter(!state)} className="sr-only peer" />
                <div className="fbsync-checkbox-toggle"></div>
              </label>
              <span className="fbsync-checkbox-text">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacebookSync;
