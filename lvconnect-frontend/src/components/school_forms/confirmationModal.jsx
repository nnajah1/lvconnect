
import DynamicModal from "@/components/dynamic/DynamicModal";

const ConfirmationModal = ({ isOpen, closeModal, children, title, description}) => {
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
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-[#2CA4DD] text-white rounded"
            >
                {children}
            </button>
        </DynamicModal>
    );
};

export default ConfirmationModal;
