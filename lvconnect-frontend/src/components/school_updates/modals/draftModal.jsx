
import DynamicModal from "@/components/dynamic/DynamicModal";

const DraftModal = ({ isOpen, closeModal }) => {
    return (
        <DynamicModal
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
                className="mt-4 px-4 py-2 bg-[#2CA4DD] text-white rounded"
            >
                Manage Your Posts 
            </button>
        </DynamicModal>
    );
};

export default DraftModal;
