
import DynamicModal from "@/components/dynamic/DynamicModal";
import { Loader } from "@/components/dynamic/loader";
import ConfirmationModal, { InfoModal } from "@/components/dynamic/alertModal";
import SurveyBuilder from "@/components/survey/SurveyBuilder";
import { useRef, useState } from "react";

const CreateSurveyModal = ({ isOpen, closeModal, loadSurveys }) => {

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const builderRef = useRef();
    // const handleSuccess = (formId) => {
    //     setIsLoading(true);

    //     setTimeout(() => {
    //         closeModal();
    //         if (formId) {
    //             setIsSuccessModalOpen(true);
    //         }
    //         setIsLoading(false);
    //     }, 2000);
    // };

      const handleOnsubmit = async () => {
        if (builderRef.current?.handleSubmit) {
            await builderRef.current.handleSubmit(); // call the submit inside SurveyBuilder
        }
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
                    title="Create Survey"
                    description="Fill out the form below to create a new survey."
                    showTitle={true}
                    showDescription={true}
                    showFooter={true}
                    headerButtons={
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                            Survey Visibility
                        </button>
                    }
                    onConfirm={handleOnsubmit}
                    confirmText="Publish Survey"
                >

                    <SurveyBuilder ref={builderRef} closeModal={closeModal} loadSurveys={loadSurveys} />

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
                    className="px-4 py-2 bg-[#1F3463] text-white rounded"
                    onClick={() => setIsSuccessModalOpen(false)}
                >
                    Manage Surveys
                </button>
            </ConfirmationModal>

        </>
    );
};

export default CreateSurveyModal;
