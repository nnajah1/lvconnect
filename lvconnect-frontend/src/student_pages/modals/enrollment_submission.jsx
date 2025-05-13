import { useState } from "react";
import PsasModal from "../psas_screens/psas_components/psas_modal";
import { BsFileEarmarkCheckFill } from "react-icons/bs";

const EnrollmentSubmission = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleSave = () => {
    setIsOpen();
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const footerButtons = (
    <div className="modal-footer-buttons">
 
      <button className="modal-cancel-button" onClick={handleSave}>Close</button>
      
      
    </div>
  );

  return (
    <PsasModal
      isOpen={isOpen}
      onClose={handleCancel}
      icon={BsFileEarmarkCheckFill }
      title="Enrollment Submited"
      message="Your Enrollment has been sucessfully submitted. You will be notice once your enrollment status Updated."
      footer={footerButtons}
      className="psas-modal-blue"
    />
    
  );
};

export default EnrollmentSubmission;
