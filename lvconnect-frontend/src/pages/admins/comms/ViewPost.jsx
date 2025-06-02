import { useEffect, useState } from "react";
import { approvePost, archivePost, deletePost, fbPost, getPostById, publishPost, rejectPost, restorePost, revisionPost } from "@/services/axios";
import DynamicModal from "@/components/dynamic/DynamicModal";
import DOMPurify from "dompurify"; // For safe HTML rendering
import { Loader } from "@/components/dynamic/loader";
import { ConfirmationModal, ErrorModal, InfoModal, WarningModal } from "@/components/dynamic/alertModal";
import { toast } from "react-toastify";
import { useUserRole } from "@/utils/userRole";

const ViewPostModal = ({ isOpen, closeModal, postId, loadUpdates, userRole, modalHandlers }) => {

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState({});

  const [restoreItem, setRestoreItem] = useState(null);

  useEffect(() => {
    if (isOpen && postId) {
      setLoading(true);
      getPostById(postId)
        .then((data) => {
          setPost(data);
          if (data?.image_url) {
            const urls = parseImageUrls(data.image_url);
            const initialStates = {};
            urls.forEach((_, idx) => {
              initialStates[idx] = "loading";
            });
            setImageLoadStates(initialStates);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, postId]);

  const parseImageUrls = (imageUrl) => {
    try {
      const urls = typeof imageUrl === "string" ? JSON.parse(imageUrl) : imageUrl;
      return Array.isArray(urls) ? urls.filter((url) => url) : [urls].filter((url) => url);
    } catch {
      return imageUrl ? [imageUrl] : [];
    }
  };

  const handleImageLoad = (index) => {
    setImageLoadStates((prev) => ({ ...prev, [index]: "loaded" }));
  };

  const handleImageError = (index) => {
    setImageLoadStates((prev) => ({ ...prev, [index]: "error" }));
  };

  const handleRestore = (item) => {
    setRestoreItem(item);
  };

  const handleRestorePost = async () => {
    setLoading(true)
    try {
      await restorePost(restoreItem.id);
      await loadUpdates();
      setRestoreItem(null)
      toast.success('Post restored successfully!');
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error('Failed to restore post');
    } finally {
      setLoading(false);
    }
  };

  // Status-based button visibility
  const shouldShowButton = (action, item) => {
    switch (action) {
      case 'edit':
        return (userRole === 'comms') && (item.status === "draft" || item.status === "rejected");
      case 'delete':
        return (userRole === 'comms') && item.status === "archived";
      case 'publish':
        return (userRole === 'comms') && item.status === "approved";
      case 'archive':
        return (userRole === 'comms') && item.status === "published";
      case 'restore':
        return (userRole === 'comms') && item.status === "archived";
      case 'postFb':
        return (userRole === 'comms') && item.status === "published" && item.status !== "published & synced";
      case 'approve':
        return (userRole === 'scadmin') && (item.status === "pending" || item.status === "revision");
      case 'reject':
        return (userRole === 'scadmin') && (item.status === "pending" || item.status === "revision");
      case 'revision':
        return (userRole === 'scadmin') && item.status === "pending";
      default:
        return false;
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center mt-4 w-[10rem] text-center">
          <Loader />
        </div>
      ) : (
        <DynamicModal
          isOpen={isOpen}
          closeModal={closeModal}
          title="View School Update"
          description="View school updates"
          showTitle={true}
          showDescription={false}
          showCloseButton={true}
          className="w-[60rem]! max-h-[70vh]! rounded-lg overflow-hidden"
        >
          {post ? (
            <div className="flex flex-col space-y-4 p-4 overflow-y-auto w-full h-full justify-around bg-white rounded-lg mt-4">
              <div className="min-h-[30vh]">

                <h1 className="text-sm text-gray-500 capitalize">{post.type}</h1>
                <div>
                  <h2 className="text-2xl font-bold text-center text-gray-900">{post.title}</h2>

                  {/* Post Content */}
                  <div
                    className="mt-4 text-gray-800 text-center whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                  />
                </div>

                {/* Facebook-style Image Grid (Below Content) */}
                {post.image_url && (() => {
                  const images = parseImageUrls(post.image_url);
                  const imageCount = images.length;

                  const getGridClass = () => {
                    switch (imageCount) {
                      case 1:
                        return "grid-cols-1";
                      case 2:
                        return "grid-cols-2";
                      case 3:
                      case 4:
                        return "grid-cols-2";
                      default:
                        return "grid-cols-3";
                    }
                  };

                  return (
                    <div className={`place-items-center grid gap-2 ${getGridClass()}`}>
                      {images.map((url, idx) => {
                        const imageUrl = `${import.meta.env.VITE_BASE_URL}${url}`;
                        const state = imageLoadStates[idx] || "loading";
                        const isPrimary = (imageCount === 3 && idx === 0) || imageCount === 1;

                        return (
                          <div
                            key={idx}
                            className={`relative group overflow-hidden rounded-lg ${isPrimary ? "col-span-2 row-span-2" : ""}`}
                            style={{
                              aspectRatio: isPrimary ? "3 / 2" : "1 / 1",
                              maxHeight: "400px",
                              minHeight: "150px",
                            }}
                          >
                            {state === "loading" && (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Loader size="small" />
                              </div>
                            )}

                            <img
                              src={state === "error" ? "/placeholder-image.png" : imageUrl}
                              alt={`Post image ${idx + 1}`}
                              className={`w-full h-full object-cover transition-opacity duration-300 ${state === "loaded" ? "opacity-100" : "opacity-0"
                                }`}

                              // crossOrigin="anonymous"
                              onLoad={() => handleImageLoad(idx)}
                              onError={() => handleImageError(idx)}
                            />

                            {state === "loaded" && (
                              <a
                                href={imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200"
                              >
                                <svg
                                  className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-between">
                {/* Timestamp */}
                <div className="text-xs text-gray-500">
                  <div>Posted on: {new Date(post.created_at).toLocaleString()}</div>
                  {post.updated_at && post.updated_at !== post.created_at && (
                    <div>Last updated: {new Date(post.updated_at).toLocaleString()}</div>
                  )}
                  {post.status && (
                    <div>Status: {post.status}</div>
                  )}
                  {post.revision_remarks && (
                    <div>Admin Remarks: {post.revision_remarks}</div>
                  )}
                </div>

                {/* Action Buttons based on status */}
                <div className="gap-2 space-x-2">
                  {shouldShowButton('edit', post) && modalHandlers?.onEdit && (
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                      onClick={() => modalHandlers.onEdit(post)}
                    >
                      Edit
                    </button>
                  )}

                  {shouldShowButton('publish', post) && modalHandlers?.onPublish && (
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                      onClick={() => modalHandlers.onPublish(post)}
                    >
                      Publish
                    </button>
                  )}

                  {shouldShowButton('archive', post) && modalHandlers?.onArchive && (
                    <button
                      className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer"
                      onClick={() => modalHandlers.onArchive(post)}
                    >
                      Archive
                    </button>
                  )}

                  {shouldShowButton('postFb', post) && modalHandlers?.onPostFb && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                      onClick={() => modalHandlers.onPostFb(post)}
                    >
                      Sync to Facebook
                    </button>
                  )}

                  {shouldShowButton('delete', post) && modalHandlers?.onDelete && (
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                      onClick={() => modalHandlers.onDelete(post)}
                    >
                      Delete
                    </button>
                  )}

                  {shouldShowButton('restore', post) && (
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                      onClick={() => handleRestore(post)}
                    >
                      Restore
                    </button>
                  )}

                  {shouldShowButton('reject', post) && modalHandlers?.onReject && (
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                      onClick={() => modalHandlers.onReject(post)}
                    >
                      Reject
                    </button>
                  )}

                  {shouldShowButton('revision', post) && modalHandlers?.onRevision && (
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                      onClick={() => modalHandlers.onRevision(post)}
                    >
                      For Revision
                    </button>
                  )}

                  {shouldShowButton('approve', post) && modalHandlers?.onApprove && (
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                      onClick={() => modalHandlers.onApprove(post)}
                    >
                      Approve
                    </button>
                  )}

                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 text-red-500">Post not found.</div>
          )}
        </DynamicModal>
      )}

      
      {restoreItem && (
        <InfoModal
          isOpen={!!restoreItem}
          closeModal={() => setRestoreItem(null)}
          title="Restore Post"
          description="Are you sure you want to restore this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setRestoreItem(null)}
          >
            cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            onClick={handleRestorePost}
            disabled={loading}
          >
            {loading ? 'Restoring...' : 'Restore'}
          </button>
        </InfoModal>
      )}
    </>
  );
};  


export default ViewPostModal;
