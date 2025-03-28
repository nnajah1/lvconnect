import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { IoArrowForwardSharp } from "react-icons/io5";
import "../communication_page/comms_styling/sucess_modal.css";

const SuccessModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal-container">
        {/* Close Button */}
        <button className="success-modal-close-btn" onClick={() => setIsOpen(false)}>
          <IoClose />
        </button>

        {/* Success Icon */}
        <FaCheckCircle className="success-modal-icon" />

        {/* Title */}
        <h2 className="success-modal-title">Posted Successfully!</h2>

        {/* Message */}
        <p className="success-modal-message">Your update is now visible to all users.</p>

        {/* Buttons */}
        <div className="success-modal-actions">
          <button className="success-modal-view-btn">View Post</button>
          <button className="success-modal-manage-btn">
            <span>Manage Your Posts</span>
            <IoArrowForwardSharp />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
