
import DynamicModal from "@/components/dynamic/DynamicModal";

const PendingModal = ({ isOpen, closeModal }) => {
    return (
        <DynamicModal
            isOpen={isOpen}
            closeModal={closeModal}
            showCloseButton={false}
            title="Post submitted for approval!"
            description="Your post has been successfully submitted and is now awaiting review by the School Admin."
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

export default PendingModal;
