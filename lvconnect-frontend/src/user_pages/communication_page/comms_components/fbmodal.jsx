import { useState } from "react";
import { BsExclamationCircleFill } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { IoArrowForwardSharp } from "react-icons/io5";
import SuccessModal from "../success_modal";
import ApprovalModal from "../switch_approval_modal";
import "../comms_styling/fbmodal.css";

const Fbmodal = ({ isOpen, onClose, facebookPages = [] }) => {
  const [isAdminApproval, setIsAdminApproval] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const toggleAdminApproval = () => setIsAdminApproval((prev) => !prev);

  const handleContinue = () => {
    if (isAdminApproval) {
      setShowApprovalModal(true); 
    } else {
      setShowSuccessModal(false); // Reset the modal state first
      setTimeout(() => setShowSuccessModal(true), 0); // Ensure modal re-renders
    }
  };
  

  if (!isOpen) return null;

  return (
    <>
      <div className="fbmodal-overlay">
        <div className="fbmodal-container">
          <button onClick={onClose} className="fbmodal-close-button">✕</button>
          <BsExclamationCircleFill className="fbmodal-warning-icon" />
          <h2 className="fbmodal-title">
            Are you sure you want to publish without Admin Approval?
          </h2>
          <p className="fbmodal-description">
            Once published, your update will be visible to all users immediately.
          </p>
          <p className="fbmodal-facebook-notice">
            This will also be posted in the following Facebook page{facebookPages.length > 1 ? "s" : ""}:
          </p>
          <div className="fbmodal-facebook-pages">
            {facebookPages.map((page, index) => (
              <div key={index} className="fbmodal-facebook-info">
                <FaFacebook className="fbmodal-facebook-icon" />
                <span>{page}</span>
              </div>
            ))}
          </div>
          <div className="fbmodal-divider"></div>
          <div className="fbmodal-admin-approval-toggle">
            <button
              onClick={toggleAdminApproval}
              className={`fbmodal-toggle-button ${isAdminApproval ? "enabled" : "disabled"}`}
            >
              <div className={`fbmodal-toggle-indicator ${isAdminApproval ? "enabled" : "disabled"}`} />
            </button>
            <span className="fbmodal-toggle-label">Enable Admin Approval</span>
          </div>
          <div className="fbmodal-actions">
            <button onClick={onClose} className="fbmodal-cancel-button">Cancel</button>
            <button onClick={handleContinue} className="fbmodal-continue-button">
              <span>Continue</span>
              <IoArrowForwardSharp />
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}

      {/* Approval Modal */}
      {showApprovalModal && <ApprovalModal onClose={() => setShowApprovalModal(false)} />}
    </>
  );
};

export default Fbmodal;

