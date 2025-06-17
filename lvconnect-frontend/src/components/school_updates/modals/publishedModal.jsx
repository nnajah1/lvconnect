
import { ConfirmationModal } from "@/components/dynamic/alertModal";
import DynamicModal from "@/components/dynamic/DynamicModal";

const PublishedModal = ({ isOpen, closeModal }) => {
    return (
        <ConfirmationModal
            isOpen={isOpen}
            closeModal={closeModal}
            showCloseButton={false}
            title="Post is Published!"
            description="Your post has been successfully published and is now visible to students"
            showTitle={true}
            showDescription={true}
            className="w-fit bg-[#EAF2FD]"
        >
            <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded"
            >
                Manage Your Posts 
            </button>
        </ConfirmationModal>
    );
};

export default PublishedModal;
