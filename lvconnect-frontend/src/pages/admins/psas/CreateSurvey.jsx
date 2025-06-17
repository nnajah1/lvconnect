
import DynamicModal from "@/components/dynamic/DynamicModal";
import { Loader } from "@/components/dynamic/loader";
import ConfirmationModal, { InfoModal } from "@/components/dynamic/alertModal";
import SurveyBuilder from "@/components/survey/SurveyBuilder";
import { useRef, useState } from "react";

const CreateSurveyModal = ({ isOpen, closeModal, loadSurveys }) => {

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const builderRef = useRef();
    
    const [visibilityMode, setVisibilityMode] = useState('hidden');
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
                    description="Create and publish new survey questionnaires for students to answer."
                    showTitle={true}
                    showDescription={true}
                    showFooter={true}
                    headerButtons={
                        <div className="flex flex-col items-start w-fit">
                            <label htmlFor="visibilityMode" className="text-sm font-medium text-slate-700 mb-1">
                                Survey Visibility
                            </label>
                            <Select value={visibilityMode} onValueChange={setVisibilityMode}>
                                <SelectTrigger
                                    id="visibilityMode"
                                    className="sm:w-64 bg-white dark:bg-slate-950 border-[#2CA4DD] dark:border-[#2CA4DD]"
                                >
                                    <SelectValue placeholder="Select visibility mode" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="hidden" className="hover:bg-[#2CA4DD] hover:text-white focus:text-white">
                                        Hidden (Not shown to users)
                                    </SelectItem>
                                    <SelectItem value="optional" className="hover:bg-[#2CA4DD] hover:text-white focus:text-white">
                                        Visible (Visible in survey list)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    }
                    onConfirm={handleOnsubmit}
                    confirmText="Publish Survey"
                >

                    <SurveyBuilder ref={builderRef} closeModal={closeModal} loadSurveys={loadSurveys} visibilityMode={visibilityMode} setVisibilityMode={setVisibilityMode}/>

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
