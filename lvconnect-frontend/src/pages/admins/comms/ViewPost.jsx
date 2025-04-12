import { useEffect, useState } from "react";
import { getPostById } from "@/services/axios";
import DynamicModal from "@/components/dynamic/DynamicModal";
import DOMPurify from "dompurify"; // For safe HTML rendering
import Loader from "@/components/dynamic/loader";

const ViewPostModal = ({ isOpen, closeModal, postId }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && postId) {
      setLoading(true);
      getPostById(postId)
        .then((data) => {
          setPost(data);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, postId]);
  

  return (
    <DynamicModal
      isOpen={isOpen}
      closeModal={closeModal}
      title="View School Update"
      description="View school updates"
      showTitle={true}
      showDescription={false}
      showCloseButton={true}
      className="max-w-[60rem]! bg-[#EAF2FD]!"
    >
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Loader />
        </div>
      ) : post ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1A2B50]">{post.title}</h2>
          <div className="text-sm text-gray-600">{post.type}</div>
          {post.image_url && (
            <div className="flex flex-wrap gap-2">
              {JSON.parse(post.image_url).map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`School Update ${idx}`}
                  className="w-[50rem] object-contain rounded"
                />
              ))}
            </div>
          )}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
        </div>
      ) : (
        <div className="text-center py-10 text-red-500">Post not found.</div>
      )}
    </DynamicModal>
  );
};

export default ViewPostModal;
