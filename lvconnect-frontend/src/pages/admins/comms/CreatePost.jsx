
import DynamicModal from "@/components/dynamic/DynamicModal";
import {Loader} from "@/components/dynamic/loader";
import CreatePostForm from "@/components/school_updates/createPostForm";
import DraftModal from "@/components/school_updates/modals/draftModal";
import PendingModal from "@/components/school_updates/modals/pendingModal";
import { useState } from "react";

const CreatePostModal = ({ isOpen, closeModal }) => {

    const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSuccess = (status) => {
        setIsLoading(true); // Show loader before transitioning

        setTimeout(() => {
            // Close the CreatePostModal after successful form submission
            closeModal(); // Close CreatePostModal
            if (status === "draft") {
                setIsDraftModalOpen(true); // Open DraftModal
            } else {
                setIsPendingModalOpen(true); // Open PendingModal
            }
            setIsLoading(false); // Stop loader after success
        }, 2000); // Show loader for 2 seconds before showing the modal (adjust timing as needed)
    };


    return (
        <>
            <DynamicModal isOpen={isOpen}
                closeModal={closeModal}
                showCloseButton={false}
                title="Create New Post"
                description="Fill out the form below to create a new post."
                showTitle={false}
                showDescription={false}
                className="max-w-[50rem]! bg-[#EAF2FD]!">


                {isLoading ? (
                    // Show loader while waiting for success
                    <div className="flex justify-center items-center mt-4">
                        <Loader />
                    </div>
                ) : (
                    // Show the CreatePostForm only when not loading
                    <CreatePostForm closeModal={closeModal} onSuccess={handleSuccess} />
                )}
            </DynamicModal>


            {/* Draft Modal */}
            <DraftModal
                isOpen={isDraftModalOpen}
                closeModal={() => setIsDraftModalOpen(false)}
            />

            {/* Pending Modal */}
            <PendingModal
                isOpen={isPendingModalOpen}
                closeModal={() => setIsPendingModalOpen(false)}
            />
        </>
    );
};

export default CreatePostModal;
