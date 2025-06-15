"use client"

import { ConfirmationModal } from "@/components/dynamic/alertModal"

const DraftModal = ({ isOpen, closeModal }) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      closeModal={closeModal}
      showCloseButton={false}
      title="Draft Saved"
      description="Announcement has been successfully saved as a draft."
 
      showTitle={true}
      showDescription={true}
      className="w-fit bg-[#EAF2FD]"
    >
      <button onClick={closeModal} className="mt-4 px-4 py-2 bg-[#1F3463] text-white rounded">
        Manage Your Posts
      </button>
    </ConfirmationModal>
  )
}

export default DraftModal
