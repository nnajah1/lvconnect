
import DynamicModal from "@/components/dynamic/DynamicModal";
import {Loader} from "@/components/dynamic/loader";
import ConfirmationModal, { InfoModal } from "@/components/dynamic/alertModal";
import EditSurvey from "@/components/survey/EditSurvey";
import { useState } from "react";

const EditSurveyModal = ({ isOpen, closeModal, formItem, onDeleteModal, onSuccessModal, load, setLoad }) => {

    const [isLoading, setIsLoading] = useState(false);
   const handleDelete = () => {
        setIsLoading(true);
        setTimeout(() => {
            closeModal();
            onDeleteModal();
            setIsLoading(false);
        }, 2000);
    };
    const handleSuccess = () => {
        setIsLoading(true);
        setTimeout(() => {
            closeModal();
            onSuccessModal();
            setIsLoading(false);
        }, 1000);
    };
 
 

    return (
        <>
            {isLoading ? (
                // Show loader while waiting for success
                <Loader />
            ) : (
                <DynamicModal isOpen={isOpen}
                    closeModal={closeModal}
                    showCloseButton={false}
                    title="Create New School Form"
                    description="Fill out the form below to update a school form."
                    showTitle={false}
                    showDescription={false}
                    className="max-w-[60rem]! max-h-[35rem]! bg-[#EAF2FD]! overflow-auto!">

                    <EditSurvey closeModal={closeModal} surveyId={formItem.id} onDelete={handleDelete} onSuccess={handleSuccess} isLoading={load} setIsLoading={setLoad}/>

                </DynamicModal>
            )}

        </>
    );
};

export default EditSurveyModal;
