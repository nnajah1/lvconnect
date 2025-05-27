import DynamicModal from "./DynamicModal";

const ConfirmationModal = ({ isOpen, closeModal, onConfirm, children, title, description }) => {
    return (
        <DynamicModal
            isOpen={isOpen}
            closeModal={closeModal}
            showCloseButton={false}
            title={title}
            description={description}
            showTitle={true}
            showDescription={true}
            className="max-w-[20rem] bg-[#EAF2FD] flex flex-col items-center justify-center"
        >
            <button
                onClick={() => {
                    onConfirm(); // Trigger the delete action when confirmed
                    closeModal(); // Close the modal after action
                }}
                className="mt-4 px-4 py-2 bg-[#2CA4DD] text-white rounded"
            >
                {children}
            </button>
            <button
                onClick={() => closeModal()} // Close the modal if cancel button clicked
                className="mt-2 px-4 py-2 bg-gray-400 text-white rounded"
            >
                Cancel
            </button>
        </DynamicModal>
    );
};

export default ConfirmationModal;
