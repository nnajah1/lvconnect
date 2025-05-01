import { useState } from "react";
import PsasModal from "../psas_components/psas_modal";
import { RiErrorWarningFill } from "react-icons/ri";

const confirmation_reject = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [placeholderText, setPlaceholderText] = useState("");

  const handleReject = () => {
  
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const footerButtons = (
    <div className="modal-footer-buttons">
      <button className="modal-cancel-button" onClick={handleCancel}>
        Cancel
      </button>
      <button className="modal-reject-button" onClick={handleReject}>
        Reject
      </button>
    </div>
  );

  return (
    <PsasModal
      isOpen={isOpen}
      onClose={handleCancel}
      icon={() => (
        <RiErrorWarningFill className="psas-modal-icon-red" />
      )}
      title={<span className="psas-modal-title-black">Are you sure you want to reject this form?</span>}
      message={
        <div className="psas-modal-message">
          <p className="psas-modal-description">
            Please provide the reason for rejection.
          </p>
          <textarea
            className="psas-reject-textarea"
            placeholder="e.g. Missing required fields or incomplete information"
            value={placeholderText}
            onChange={(e) => setPlaceholderText(e.target.value)}
          />
        </div>
      }
      footer={footerButtons}
    />
  );
};

export default confirmation_reject;
