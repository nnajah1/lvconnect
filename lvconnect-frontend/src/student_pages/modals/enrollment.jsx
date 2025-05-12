import { useState } from "react";
import PsasModal from "../psas_screens/psas_components/psas_modal";
import { BsFileEarmarkCheckFill } from "react-icons/bs";

const ConfirmationChanges = () => {
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
      title="Are you sure you want to save these changes?"
      message="The update will be visible to users once saved."
      footer={footerButtons}
      className="psas-modal-blue"
    />
    
  );
};

export default ConfirmationChanges;
