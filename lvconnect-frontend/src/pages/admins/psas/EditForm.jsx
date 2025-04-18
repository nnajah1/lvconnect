
import DynamicModal from "@/components/dynamic/DynamicModal";
import Loader from "@/components/dynamic/loader";
import EditForm from "@/components/school_forms/EditSchoolForm";
import SuccessModal from "@/components/school_updates/modals/successModal";
import { useState } from "react";

const EditFormModal = ({ isOpen, closeModal, formItem, onSuccess }) => {

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
            <DynamicModal isOpen={isOpen}
                closeModal={closeModal}
                showCloseButton={false}
                title="Create New School Form"
                description="Fill out the form below to update a school form."
                showTitle={false}
                showDescription={false}
                className="max-w-[60rem]! max-h-[35rem]! bg-[#EAF2FD]! overflow-auto!">


                {isLoading ? (
                    // Show loader while waiting for success
                    <div className="flex justify-center items-center mt-4 w-[20rem]">
                        <Loader />
                    </div>
                ) : (
                    <EditForm closeModal={closeModal} onSuccess={handleSuccess} formId={formItem.id} />
                )}
            </DynamicModal>


            {/* Success Modal */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                closeModal={() => setIsSuccessModalOpen(false)}
                // title="School Form Updated"
                // description="The school form has been updated successfully"
            >
                Manage School Forms 
            </SuccessModal>

        </>
    );
};

export default EditFormModal;
