
import DynamicModal from "@/components/dynamic/DynamicModal";
import { Loader } from "@/components/dynamic/loader";
import ConfirmationModal, { InfoModal } from "@/components/dynamic/alertModal";
import SurveyBuilder from "@/components/survey/SurveyBuilder";
import { useState } from "react";
import CreateAccountForm from "@/components/role_management/createAccount";
import AccountForm from "@/components/role_management/createAccount";

const EditAccountModal = ({ isOpen, closeModal, availableRoles, fetchData, initialData, mode }) => {

    const [isLoading, setIsLoading] = useState(false);



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
                    title="Edit Account"
                    description="Fill out the form below to edit an account."
                    showTitle={false}
                    showDescription={false}
                    className="max-w-[45rem]! max-h-[35rem]! bg-[#EAF2FD]! overflow-auto!">

                    <AccountForm
                        isOpen={isOpen}
                        closeModal={closeModal}
                        availableRoles={availableRoles}
                        fetchData={fetchData}
                        initialData={initialData}
                        mode={mode}
                    />
                </DynamicModal>
            )}

        </>
    );
};

export default EditAccountModal;
