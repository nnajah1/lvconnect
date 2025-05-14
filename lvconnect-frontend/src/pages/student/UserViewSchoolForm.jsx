
import DynamicModal from "@/components/dynamic/DynamicModal";
import Loader from "@/components/dynamic/loader";
import ConfirmationModal from "@/components/dynamic/alertModal";
import ShowSubmission from "@/components/school_forms/userViewSchoolForm";
import { useAuthContext } from "@/context/AuthContext";

import { useState } from "react";

const UserViewFormModal = ({ isOpen, closeModal, submittedItem, }) => {

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();
    const userRole = user?.roles?.[0]?.name;
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
                    className="max-w-[60rem]! max-h-[35rem]! bg-[#EAF2FD]! overflow-auto!">

                    <ShowSubmission closeModal={closeModal} onSuccess={handleSuccess} formId={submittedItem.id} userRole={userRole}/>

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

export default UserViewFormModal;
