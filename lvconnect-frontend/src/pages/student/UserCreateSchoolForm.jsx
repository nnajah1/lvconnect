
import DynamicModal from "@/components/dynamic/DynamicModal";
import Loader from "@/components/dynamic/loader";
import UserFormView from "@/components/school_forms/userSubmitForm"
import ConfirmationModal from "@/components/dynamic/alertModal";
import { useState } from "react";
import StudentEditForm from "@/components/school_forms/userSubmitForm";

const UserCreateFormModal = ({ isOpen, closeModal, formItem, }) => {

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
                    showCloseButton={false}
                    title="Create New School Form"
                    description="Fill out the form below to update a school form."
                    showTitle={false}
                    showDescription={false}
                    className="max-w-[50rem]! max-h-[35rem]! bg-[#EAF2FD]! overflow-auto!">

                    <StudentEditForm closeModal={closeModal} onSuccess={handleSuccess} formId={formItem.id} />

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

export default UserCreateFormModal;
