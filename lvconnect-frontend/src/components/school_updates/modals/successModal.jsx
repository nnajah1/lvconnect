
import DynamicModal from "@/components/dynamic/DynamicModal";

const SuccessModal = ({ isOpen, closeModal, children}) => {
    return (
        <DynamicModal
            isOpen={isOpen}
            closeModal={closeModal}
            showCloseButton={false}
            title="School Form Updated"
            description="The school form has been updated successfully"
            showTitle={true}
            showDescription={true}
            className="max-w-[400px] bg-[#EAF2FD]"
        >
            <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-[#2CA4DD] text-white rounded flex items-center justify-center"
            >
                {children}
            </button>
        </DynamicModal>
    );
};

export default SuccessModal;
