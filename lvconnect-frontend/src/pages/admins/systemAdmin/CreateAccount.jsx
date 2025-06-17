
import DynamicModal from "@/components/dynamic/DynamicModal";
import { Loader } from "@/components/dynamic/loader";
import ConfirmationModal, { InfoModal } from "@/components/dynamic/alertModal";
import SurveyBuilder from "@/components/survey/SurveyBuilder";
import { useState } from "react";
import CreateAccountForm from "@/components/role_management/createAccount";
import AccountForm from "@/components/role_management/createAccount";

const CreateAccountModal = ({ isOpen, closeModal, availableRoles, fetchData }) => {

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
                    title="Create New User"
                    description="Fill out the form below to create a new user."
                    showTitle={true}
                    showDescription={true}
                    // className="max-w-[45rem]! max-h-[35rem]! bg-[#EAF2FD]! overflow-auto!"
                    >

                    <AccountForm
                        isOpen={isOpen}
                        closeModal={closeModal}
                        availableRoles={availableRoles}
                        fetchData={fetchData}
                    />
                </DynamicModal>
            )}

        </>
    );
};

export default CreateAccountModal;
