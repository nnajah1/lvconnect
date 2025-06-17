import { useEffect, useState } from "react";
import { getPostById } from "@/services/axios";
import DynamicModal from "@/components/dynamic/DynamicModal";
import DOMPurify from "dompurify"; // For safe HTML rendering
import { Loader } from "@/components/dynamic/loader";
import CreatePostForm from "@/components/school_updates/createPostForm";

const EditPostModal = ({ isOpen, closeModal, postId, loadUpdates }) => {
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
        <div className="flex justify-center items-center mt-4 w-[10rem] text-center">
          <Loader />
        </div>
      ) : (
        <DynamicModal
          isOpen={isOpen}
          closeModal={closeModal}
          title="Edit School Update"
          description="View school updates"
          showTitle={true}
          showDescription={false}
          showCloseButton={true}
          // className="w-[60rem]! h-[50rem]! bg-[#EAF2FD]!"
        >
          <CreatePostForm
            closeModal={closeModal}
            existingPost={postId}
            // onSuccess={handleSuccess}
            loadUpdates={loadUpdates}
          />
        </DynamicModal>
      )}
    </>
  );
};


export default EditPostModal;
