
import DynamicModal from "@/components/dynamic/DynamicModal";
import { Loader } from "@/components/dynamic/loader";
import CreatePostForm from "@/components/school_updates/createPostForm";
import DraftModal from "@/components/school_updates/modals/draftModal";
import PendingModal from "@/components/school_updates/modals/pendingModal";
import PublishedModal from "@/components/school_updates/modals/publishedModal";
import { useState } from "react";

const CreatePostModal = ({ isOpen, closeModal, loadUpdates }) => {

    const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false)
    const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSuccess = (status) => {
        setIsLoading(true); 

        setTimeout(() => {
            closeModal();
            if (status === "draft") {
                setIsDraftModalOpen(true); 
            } else if (status === "pending") {
                setIsPendingModalOpen(true); 
            } else {
                setIsPublishedModalOpen(true); 
            }
            setIsLoading(false); 
        }, 2000);
    };


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
                    title="Create New Post"
                    description="Fill out the form below to create a new post."
                    showTitle={false}
                    showDescription={false}
                    className="max-w-[50rem]! bg-[#EAF2FD]!">

                    <CreatePostForm closeModal={closeModal} onSuccess={handleSuccess} loadUpdates={loadUpdates} />

                </DynamicModal>
            )}

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
            <PublishedModal
                isOpen={isPublishedModalOpen}
                closeModal={() => setIsPublishedModalOpen(false)}
            />
        </>
    );
};

export default CreatePostModal;
