import { HiMiniClipboardDocumentCheck } from "react-icons/hi2";
import "../student_styling/emergencyhotline.css";

const EmergencyHotline = ({ isOpen = true, onClose, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="emergency-overlay" onClick={onClose}>
      <div
        className={`emergency-card ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="emergency-header">
          <div className="emergency-icon-container">
            <HiMiniClipboardDocumentCheck className="emergency-icon" />
          </div>
          <h2 className="emergency-title">Stay safe, La Verdarian!</h2>
        </div>

        <div className="emergency-content">
          <p>Your response has been recorded.</p>
          <p>Stay updated on further announcements.</p>

          <div className="emergency-separator" />

          <h3 className="emergency-section-title">Emergency Hotlines</h3>

          <div className="emergency-hotlines-grid">
            <div className="emergency-hotline-column">
              <p className="emergency-hotline-number">911-UNTV</p>
              <p className="emergency-hotline-detail">(911-8688)</p>
              <p className="emergency-hotline-detail">UNTV</p>
            </div>

            <div className="emergency-hotline-column">
              <p className="emergency-hotline-number">0923-544-5376</p>
              <p className="emergency-hotline-detail-blue">0915-482-5540</p>
              <p className="emergency-hotline-detail">UNTV</p>
            </div>

            <div className="emergency-hotline-column">
              <p className="emergency-hotline-number">0931-047-5410</p>
              <p className="emergency-hotline-detail">APALIT BFP</p>
            </div>
          </div>
        </div>

        <div className="emergency-footer">
          <button className="emergency-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyHotline;
