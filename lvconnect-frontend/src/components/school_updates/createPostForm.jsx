import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import SwitchComponent from "@/components/dynamic/switch";
import TooltipComponent from "@/components/dynamic/tooltip";
import { BsFillInfoCircleFill } from "react-icons/bs";
import api, { createPost, getSignedUrl, updatePost, uploadToSupabase } from "@/services/axios"; // Import API function
import TextEditor from "@/components/school_updates/textEditor"; // Quill Editor
import { toast } from "react-toastify";
import { ConfirmationModal, InfoModal } from "../dynamic/alertModal";


const CreatePostForm = ({ closeModal, existingPost, loadUpdates, onSuccess }) => {
  const [selectedType, setSelectedType] = useState(existingPost?.type || "announcement");
  const [title, setTitle] = useState(existingPost?.title || "");
  const [content, setContent] = useState(existingPost?.content || "");
  const [images, setImages] = useState([]);
  const [isNotified, setIsNotified] = useState(existingPost?.is_notified === 1);
  const [isUrgent, setIsUrgent] = useState(existingPost?.is_urgent === 1);
  const [postId, setPostId] = useState(existingPost?.id || null);
  const [status, setStatus] = useState({ draft: false, pending: false, published: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");

  const isEditMode = Boolean(existingPost?.id);

  // Initialize form with existing post data
  useEffect(() => {
    if (existingPost) {
      setSelectedType(existingPost.type || "announcement");
      setTitle(existingPost.title || "");
      setContent(existingPost.content || "");
      setIsNotified(existingPost.is_notified === 1);
      setIsUrgent(existingPost.is_urgent === 1);
      setPostId(existingPost.id || null);

      // Convert existing images to preview format
      try {
        let parsedImages = [];
        if (existingPost.image_url) {
          parsedImages = typeof existingPost.image_url === 'string'
            ? JSON.parse(existingPost.image_url)
            : existingPost.image_url;
        }
        const imageArray = Array.isArray(parsedImages) ? parsedImages : [parsedImages];
        setImages(imageArray.filter(url => url).map(url => ({ url })));
      } catch {
        if (existingPost.image_url) {
          setImages([{ url: existingPost.image_url }]);
        }
      }
    }
  }, [existingPost]);

  useEffect(() => {
    if (isUrgent) setIsNotified(true);
  }, [isUrgent]);

  const validateForm = () => {
    if (!title || !content || content.trim() === "<p><br></p>") {
      toast.error("Please fill out all required fields.");
      return false;
    }
    return true;
  };

  const preparePostPayload = async (action, isEditMode = false) => {
    const newImages = images.filter(img => img.file);
    const existingImages = images
      .filter(img => !img.file && img.url && isEditMode)
      .map((img) => img.path || img.url);

    let uploadedUrls = [];
    if (newImages.length > 0) {
      const files = newImages.map(img => img.file);
      uploadedUrls = await uploadToSupabase(files);
    }

    const imageUrls = [...existingImages, ...uploadedUrls];

    return {
      title,
      type: selectedType.toLowerCase(),
      content,
      is_notified: isNotified ? 1 : 0,
      is_urgent: isUrgent ? 1 : 0,
      image_paths: imageUrls,
      status: isUrgent ? "published" : action,
    };
  };


  const handleSubmitPost = async (action) => {
    if (!validateForm()) return;

    setStatus(prev => ({ ...prev, [action]: true }));
    setIsLoading(true);
    setError(null);

    try {
      const payload = await preparePostPayload(action);
      const response = isEditMode
        ? await updatePost(postId, payload)
        : await createPost(payload);

      setPostId(response.id);

      if (closeModal) closeModal();
      if (onSuccess) onSuccess(action);

      const successMessage = isUrgent
        ? "Urgent post published immediately!"
        : `Post ${isEditMode ? 'updated' : 'created'} successfully!`;

      toast.success(successMessage);
    } catch (err) {
      console.error("Post error:", err);
      const errorMessage = err.message || err.response?.data?.message ||
        `Failed to ${isEditMode ? 'update' : 'create'} post!`;
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} post!`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setStatus(prev => ({ ...prev, [action]: false }));
    }
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    await handleSubmitPost(action);
    await loadUpdates();
  };

  const canEdit = !isEditMode || !existingPost?.status || ['draft', 'revision', 'rejected'].includes(existingPost.status);

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center">
        <button
          onClick={closeModal}
          className="text-xl text-gray-700 hover:text-gray-900 cursor-pointer"
        >
          <IoArrowBack />
        </button>
        <h2 className="text-xl font-semibold text-blue-500 flex-grow text-center">
          {isEditMode ? "Edit Post" : "Create New Post"}
        </h2>
      </div>

      {isEditMode && !canEdit && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          This post cannot be edited as it has already been submitted or published.
        </div>
      )}

      {/* {error && <p className="text-red-500 text-center">{error}</p>} */}

      <div className="flex items-center justify-between gap-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          disabled={!canEdit}
        >
          <option value="announcement">Announcement</option>
          <option value="event">Event</option>
        </select>
        <div className="flex items-center gap-2">
          <SwitchComponent
            label="Urgent"
            checked={isUrgent}
            onCheckedChange={() => canEdit && setIsUrgent(!isUrgent)}
            disabled={!canEdit}
          />
          <SwitchComponent
            label="Notification"
            checked={isNotified}
            onCheckedChange={() => canEdit && !isUrgent && setIsNotified(!isNotified)}
            disabled={!canEdit || isUrgent}
          />
        </div>
      </div>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded-md"
        disabled={!canEdit}
      />

      <TextEditor
        content={content}
        onContentChange={setContent}
        images={images}
        onImagesChange={setImages}
        disabled={!canEdit}
      />

      {canEdit && (
        <div className="flex flex-wrap gap-2 justify-end mt-4">
          <button
            type="button"
            disabled={status.draft || isLoading}
            onClick={(e) => handleSubmit(e, "draft")}
            className={`px-4 py-2 rounded ${status.draft || isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-600 text-white"}`}
          >
            {status.draft ? "Saving..." : `${isEditMode ? "Update" : "Save"} as Draft`}
          </button>

          {!isUrgent && (
            <button
              type="button"
              disabled={status.pending || isLoading}
              onClick={() => {
                setConfirmAction("pending");
                setShowConfirmation(true);
              }}
              className={`px-4 py-2 rounded ${status.pending || isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"}`}
            >
              {status.pending ? "Submitting..." : `${isEditMode ? "Update &" : ""} Submit`}
            </button>
          )}

          {isUrgent && (
            <button
              type="button"
              disabled={status.published || isLoading}
              onClick={() => {
                setConfirmAction("published");
                setShowConfirmation(true);
              }}
              className={`px-4 py-2 rounded ${status.published || isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"}`}
            >
              {status.published ? "Publishing..." : `${isEditMode ? "Update &" : ""} Publish`}
            </button>
          )}
        </div>
      )}

      <InfoModal
        isOpen={showConfirmation}
        closeModal={() => setShowConfirmation(false)}
        title={confirmAction === "pending"
          ? `${isEditMode ? "Update & " : ""}Submit for Approval`
          : `${isEditMode ? "Update & " : ""}Publish Post`}
        description={`Are you sure you want to ${confirmAction === "pending"
          ? `${isEditMode ? "update and " : ""}submit this post for approval`
          : `${isEditMode ? "update and " : ""}publish this post immediately`}?`}
      >
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={(e) => {
              handleSubmit(e, confirmAction);
              setShowConfirmation(false);
            }}
          >
            Confirm
          </button>
        </div>
      </InfoModal>
    </div>
  );
};


export default CreatePostForm;