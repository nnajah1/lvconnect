import { useState } from "react";
import PsasModal from "@/psas_screens/psas_components/psas_modal";
import { IoArrowForwardSharp } from "react-icons/io5";
import { BsFileEarmarkCheckFill } from "react-icons/bs";

const SchoolFormsApproved = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <PsasModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      icon={BsFileEarmarkCheckFill}
      title="School Form Approved"
    
      message={
        <>
          This form has been successfully Approved. <br />
         It now available for printing.
        </>
      }
      buttonText={
        <>
        View School Forms <IoArrowForwardSharp className="draft-modal-button-icon" />
        </>
      }
      className="psas-modal-blue"

    />

  );
};

export default SchoolFormsApproved;
