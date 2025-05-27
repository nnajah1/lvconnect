
import DynamicModal from "@/components/dynamic/DynamicModal";
import {Loader} from "@/components/dynamic/loader";
import ConfirmationModal from "@/components/dynamic/alertModal";
import SurveyAnswerView from "@/components/survey/userSubmitSurvey";
import { useState } from "react";

const UserCreateSurveyModal = ({ isOpen, closeModal, formItem, load, }) => {

    const [isLoading, setIsLoading] = useState(false);

    const handleSuccess = () => {
        // setIsLoading(true);
        // setTimeout(() => {
        //     closeModal();
        //     // onConfirmModal();
        //     setIsLoading(false);
        // }, 1000);
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

                    <SurveyAnswerView isOpen={isOpen} closeModal={closeModal} onSuccess={handleSuccess} surveyId={formItem.id} load={load}/>

                </DynamicModal>
            )}



        </>
    );
};

export default UserCreateSurveyModal;
