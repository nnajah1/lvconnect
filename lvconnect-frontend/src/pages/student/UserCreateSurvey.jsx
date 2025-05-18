
import DynamicModal from "@/components/dynamic/DynamicModal";
import {Loader} from "@/components/dynamic/loader";
import ConfirmationModal from "@/components/dynamic/alertModal";
import SurveyAnswerView from "@/components/survey/userSubmitSurvey";
import { useState } from "react";

const UserCreateSurveyModal = ({ isOpen, closeModal, formItem }) => {

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSuccess = () => {
        setIsLoading(true);

        setTimeout(() => {
            // closeModal();
            // if (formId) {
            setIsSuccessModalOpen(true);
            // }
            setIsLoading(false);
        }, 2000);
    };

    return (
        <>
            {isLoading ? (
                // Show loader while waiting for success
                <Loader />
            ) : (
                <DynamicModal isOpen={isOpen}
                    closeModal={closeModal}
                    title="Submit Survey"
                    description="Fill out the survey."
                    showTitle={false}
                    showDescription={false}
                    className="max-w-[60rem]! max-h-[35rem]! bg-[#EAF2FD]! overflow-auto!">

                    <SurveyAnswerView isOpen={isOpen} closeModal={closeModal} onSuccess={handleSuccess} surveyId={formItem.id} />

                </DynamicModal>
            )}

            <ConfirmationModal

                isOpen={isSuccessModalOpen}
                closeModal={() => setIsSuccessModalOpen(false)}
                title="The School Form is updated"
                description="The School Form has been successfully updated."
            >
                Manage School Forms
            </ConfirmationModal>



        </>
    );
};

export default UserCreateSurveyModal;
