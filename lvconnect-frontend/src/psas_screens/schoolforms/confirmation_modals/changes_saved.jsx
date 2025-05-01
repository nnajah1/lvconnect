import { useState } from "react";
import InfoModal from "@/psas_screens/psas_components/psas_modal";
import { IoArrowForwardSharp } from "react-icons/io5";
import { BsFileEarmarkCheckFill } from "react-icons/bs";

const ChangesSaved = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      icon={BsFileEarmarkCheckFill}
      title="Changes Saved!"
      message={
        <>
          This form has been successfully updated and is now visible to users.
        </>
      }
      buttonText={
        <>
          View School Forms{" "}
          <IoArrowForwardSharp className="draft-modal-button-icon" />
        </>
      }
      className="psas-modal-blue"
    />
  );
};

export default ChangesSaved;
