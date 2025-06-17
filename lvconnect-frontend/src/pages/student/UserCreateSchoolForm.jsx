
import DynamicModal from "@/components/dynamic/DynamicModal";
import {Loader} from "@/components/dynamic/loader";
import UserFormView from "@/components/school_forms/userSubmitForm"
import ConfirmationModal from "@/components/dynamic/alertModal";
import { useState } from "react";
import StudentEditForm from "@/components/school_forms/userSubmitForm";

const UserCreateFormModal = ({ isOpen, closeModal, formItem, setIsSuccessModalOpen }) => {

    
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
                <Loader />
            ) : (
                <DynamicModal isOpen={isOpen}
                    closeModal={closeModal}
                    showCloseButton={false}
                    title="Create School Form"
                    description="Fill out the form below to update a school form."
                    showTitle={true}
                    showDescription={false}
                    // className="max-w-[60rem]! max-h-[85vh]! bg-[#EAF2FD]! overflow-auto!"
                    >

                    <StudentEditForm closeModal={closeModal} formId={formItem.id} />

                </DynamicModal>
            )}

        </>
    );
};

export default UserCreateFormModal;
