
import DynamicModal from "@/components/dynamic/DynamicModal";
import {Loader} from "@/components/dynamic/loader";
import ConfirmationModal, { InfoModal } from "@/components/dynamic/alertModal";
import SurveyBuilder from "@/components/survey/SurveyBuilder";
import { useState } from "react";

const CreateSurveyModal = ({ isOpen, closeModal }) => {

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
                    className="max-w-[45rem]! max-h-[35rem]! bg-[#EAF2FD]! overflow-auto!">

                    <SurveyBuilder closeModal={closeModal} onSuccess={handleSuccess} />

                </DynamicModal>
            )}


            {/* Success Modal */}
            <ConfirmationModal
                isOpen={isSuccessModalOpen}
                closeModal={() => setIsSuccessModalOpen(false)}
                title="The Survey is created"
                description="The Survey has been successfully created."
            >
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => setIsSuccessModalOpen(false)}
                >
                    Manage Surveys
                </button>
            </ConfirmationModal>
            
        </>
    );
};

export default CreateSurveyModal;
