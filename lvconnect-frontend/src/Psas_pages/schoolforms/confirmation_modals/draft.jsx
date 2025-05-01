import { useState } from "react";
import PsasModal from "@/Psas_pages/psas_components/psas_modal";
import { IoArrowForwardSharp } from "react-icons/io5";
import { HiPencilSquare } from "react-icons/hi2";

const Draft = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <PsasModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      icon={HiPencilSquare}
      title="Draft Saved"
      message={
        <>
          This form has been successfully saved as a draft. <br />
          You can review, edit, or upload it anytime from your drafts list.
        </>
      }
      buttonText={
        <>
          Manage School Forms{" "}
          <IoArrowForwardSharp className="draft-modal-button-icon" />
        </>
      }

    />
  );
};

export default Draft;
