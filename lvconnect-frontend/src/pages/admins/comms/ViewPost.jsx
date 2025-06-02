import { useEffect, useState } from "react";
import { archivePost, deletePost, fbPost, getPostById, publishPost } from "@/services/axios";
import DynamicModal from "@/components/dynamic/DynamicModal";
import DOMPurify from "dompurify"; // For safe HTML rendering
import { Loader } from "@/components/dynamic/loader";
import { ErrorModal, InfoModal, WarningModal } from "@/components/dynamic/alertModal";
import { toast } from "react-toastify";

const ViewPostModal = ({ isOpen, closeModal, postId, loadUpdates }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState({});
  
  // State for modals
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [publishItem, setPublishItem] = useState(null);
  const [archiveItem, setArchiveItem] = useState(null);
  const [postItem, setPostItem] = useState(null);

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

  // Button handlers
  const handleEdit = (item) => {
    setEditItem(item);
  };

  const handleDelete = (item) => {
    setDeleteItem(item);
  };

  const handlePublish = (item) => {
    setPublishItem(item);
  };

  const handleArchive = (item) => {
    setArchiveItem(item);
  };

  const handlePostFb = (item) => {
    setPostItem(item);
  };

  // Action handlers
  const handleDeletePost = async () => {
    setLoading(true);
    try {
      await deletePost(deleteItem.id);
      toast.success('Post deleted successfully!');
      setDeleteItem(null);
      await loadUpdates();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  const handleArchivePost = async () => {
    setLoading(true);
    try {
      await archivePost(archiveItem.id);
      await loadUpdates();
      closeModal();
      toast.success('Post archived successfully!');
      setArchiveItem(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to archive post');
    } finally {
      setLoading(false);
    }
  };

  const handleFbPost = async () => {
    setLoading(true);
    try {
      const response = await fbPost(postItem.id);
      await loadUpdates();
      closeModal();
      toast.success('Post synced to Facebook successfully!');
      setPostItem(null);
      console.log('FB Response:', response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync to Facebook');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishPost = async () => {
    setLoading(true);
    try {
      await publishPost(publishItem.id);
      await loadUpdates();
      closeModal();
      toast.success('Post published successfully!');
      setPublishItem(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  // Status-based button visibility
  const shouldShowButton = (action, item) => {
    switch (action) {
      case 'edit':
        return item.status === "draft" || item.status === "rejected";
      case 'delete':
        return item.status === "archived";
      case 'publish':
        return item.status === "approved";
      case 'archive':
        return item.status === "published";
      case 'postFb':
        return item.status === "published" && item.status !== "published & synced";
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
          className="w-[60rem]! max-h-[80vh]! rounded-lg overflow-hidden"
        >
          {post ? (
            <div className="space-y-4 p-4 overflow-y-auto  bg-white rounded-lg mt-4">
            
              <h1 className="text-sm text-gray-500 capitalize">{post.type}</h1>
              <h2 className="text-2xl font-bold text-center text-gray-900">{post.title}</h2>

              {/* Post Content */}
              <div
                className="mt-4 text-gray-800 text-center whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />

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
                            className={`w-full h-full object-cover transition-opacity duration-300 ${
                              state === "loaded" ? "opacity-100" : "opacity-0"
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

              {/* Timestamp */}
              <div className="text-xs text-gray-500 mt-4">
                <div>Posted on: {new Date(post.created_at).toLocaleString()}</div>
                {post.updated_at && post.updated_at !== post.created_at && (
                  <div>Last updated: {new Date(post.updated_at).toLocaleString()}</div>
                )}
              </div>
              
              {/* Action Buttons based on status */}
              <div className="flex gap-2 justify-end mt-6">
                {shouldShowButton('edit', post) && (
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </button>
                )}
                
                {shouldShowButton('publish', post) && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                    onClick={() => handlePublish(post)}
                  >
                    Publish
                  </button>
                )}
                
                {shouldShowButton('archive', post) && (
                  <button
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer"
                    onClick={() => handleArchive(post)}
                  >
                    Archive
                  </button>
                )}
                
                {shouldShowButton('postFb', post) && (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                    onClick={() => handlePostFb(post)}
                  >
                    Sync to Facebook
                  </button>
                )}
                
                {shouldShowButton('delete', post) && (
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                    onClick={() => handleDelete(post)}
                  >
                    Delete
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-10 text-red-500">Post not found.</div>
          )}
        </DynamicModal>
      )}

      {/* Delete Modal */}
      {deleteItem && (
        <WarningModal
          isOpen={!!deleteItem}
          closeModal={() => setDeleteItem(null)}
          title="Delete Post"
          description="Are you sure you want to delete this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setDeleteItem(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            onClick={handleDeletePost}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </WarningModal>
      )}

      {/* Archive Modal */}
      {archiveItem && (
        <WarningModal
          isOpen={!!archiveItem}
          closeModal={() => setArchiveItem(null)}
          title="Archive Post"
          description="Are you sure you want to archive this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setArchiveItem(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer"
            onClick={handleArchivePost}
            disabled={loading}
          >
            {loading ? 'Archiving...' : 'Archive'}
          </button>
        </WarningModal>
      )}

      {/* Facebook Post Modal */}
      {postItem && (
        <InfoModal
          isOpen={!!postItem}
          closeModal={() => setPostItem(null)}
          title="Post to Facebook"
          description="Are you sure you want to post this post on Facebook? this is irreversible"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setPostItem(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            onClick={handleFbPost}
            disabled={loading}
          >
            {loading ? 'Syncing...' : 'Sync To Facebook'}
          </button>
        </InfoModal>
      )}

      {/* Publish Modal */}
      {publishItem && (
        <ConfirmationModal
          isOpen={!!publishItem}
          closeModal={() => setPublishItem(null)}
          title="Publish Post"
          description="Are you sure you want to publish this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setPublishItem(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
            onClick={handlePublishPost}
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </ConfirmationModal>
      )}
    </>
  );
};


export default ViewPostModal;
