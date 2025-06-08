
import DynamicModal from "@/components/dynamic/DynamicModal";
import {Loader} from "@/components/dynamic/loader";
import EditForm from "@/components/school_forms/EditSchoolForm";
import ConfirmationModal from "@/components/dynamic/alertModal";
import { useState } from "react";

const EditFormModal = ({ isOpen, closeModal, formItem, onDeleteModal, onSuccessModal}) => {

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
                    className="max-w-[90vw]! max-h-[85vh]! bg-[#EAF2FD]! overflow-auto!">

                    <EditForm closeModal={closeModal}  onDelete={handleDelete} onSuccess={handleSuccess} formId={formItem.id} />

                </DynamicModal>
            )}

        </>
    );
};

export default EditFormModal;
