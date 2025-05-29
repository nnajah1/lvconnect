
import { ConfirmationModal } from "@/components/dynamic/alertModal";
import DynamicModal from "@/components/dynamic/DynamicModal";

const DraftModal = ({ isOpen, closeModal }) => {
    return (
        <ConfirmationModal
            isOpen={isOpen}
            closeModal={closeModal}
            showCloseButton={false}
            title="Draft Saved"
            description="Your announcement has been successfully saved as a draft. 
You can review, edit, or publish it anytime from your drafts list."
            showTitle={true}
            showDescription={true}
            className="max-w-[400px] bg-[#EAF2FD]"
        >
            <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
                Manage Your Posts 
            </button>
        </ConfirmationModal>
    );
};

export default DraftModal;
