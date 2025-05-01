import { useState } from "react";
import PsasModal from "@/psas_screens/psas_components/psas_modal";
import { IoArrowForwardSharp } from "react-icons/io5";;
import { IoMdCloseCircle } from "react-icons/io";

const SchoolFormsApproved = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <PsasModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      icon={IoMdCloseCircle}
      title="This Form has been rejected"
    
      message={
        <>
          The notificationwill be sent to the student, including the reason for rejection, <br />
          they can review and make necessary correction if needed.
        </>
      }
      buttonText={
        <>
        View School Forms <IoArrowForwardSharp className="draft-modal-button-icon" />
        </>
      }
      className="psas-modal-red"

    />

  );
};

export default SchoolFormsApproved;
