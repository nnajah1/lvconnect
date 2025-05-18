
import DynamicModal from "@/components/dynamic/DynamicModal";
import { Loader } from "@/components/dynamic/loader";
import FormBuilder from "@/components/school_forms/FormBuilder";
import ConfirmationModal from "@/components/dynamic/alertModal";
import { useState } from "react";

const CreateFormModal = ({ isOpen, closeModal }) => {

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSuccess = (formId) => {
        setIsLoading(true);

        setTimeout(() => {
            closeModal();
            if (formId) {
                setIsSuccessModalOpen(true);
            }
            setIsLoading(false);
        }, 2000);
    };

    return (
        <>
            {isLoading ? (
                // Show loader while waiting for success
                <div className="flex justify-center items-center mt-4 w-[10rem] text-center">
                    <Loader />
                </div>
            ) : (
                <DynamicModal isOpen={isOpen}
                    closeModal={closeModal}
                    showCloseButton={false}
                    title="Create New School Form"
                    description="Fill out the form below to create a new school form."
                    showTitle={false}
                    showDescription={false}
                    className="max-w-[70rem]! max-h-[35rem]! bg-[#EAF2FD]! overflow-auto!">

                    <FormBuilder closeModal={closeModal} onSuccess={handleSuccess} />

                </DynamicModal>
            )}


            {/* Success Modal */}
            <ConfirmationModal
                isOpen={isSuccessModalOpen}
                closeModal={() => setIsSuccessModalOpen(false)}
                title="The School Form is created"
                description="The School Form has been successfully created."
            >
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => setIsSuccessModalOpen(false)}
                >
                    Manage School Forms
                </button>

            </ConfirmationModal>

        </>
    );
};

export default CreateFormModal;
