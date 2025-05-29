import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import SwitchComponent from "@/components/dynamic/switch";
import TooltipComponent from "@/components/dynamic/tooltip";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { createPost, updatePost, publishPost } from "@/services/axios"; // Import API function
import TextEditor from "@/components/school_updates/textEditor"; // Quill Editor
import { toast } from "react-toastify";
import { ConfirmationModal, InfoModal } from "../dynamic/alertModal";


const CreatePostForm = ({ closeModal, existingPost, load, onSuccess }) => {
  const [selectedType, setSelectedType] = useState(existingPost?.type || "announcement");
  const [title, setTitle] = useState(existingPost?.title || "");
  const [content, setContent] = useState(existingPost?.content || "");
  const [images, setImages] = useState(() => {
    try {
      return existingPost?.image_url ? JSON.parse(existingPost.image_url) : [];
    } catch {
      return [];
    }
  });
  const [isNotified, setIsNotified] = useState(existingPost?.is_notified === 1);
  const [isUrgent, setIsUrgent] = useState(existingPost?.is_urgent === 1);
  const [postId, setPostId] = useState(existingPost?.id || null);

  const [status, setStatus] = useState({ draft: false, pending: false, published: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmAction, setConfirmAction] = useState(""); // 'pending' or 'published'

  // Check if this is an edit mode
  const isEditMode = Boolean(existingPost?.id);

  useEffect(() => {
    if (isUrgent) setIsNotified(true);
  }, [isUrgent]);

  // Validation helper
  const validateForm = () => {
    if (!title || !content || content.trim() === "<p><br></p>") {
      toast.error("Please fill out all required fields.");
      return false;
    }
    return true;
  };

  // Common form data preparation
  const prepareFormData = (action) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", selectedType.toLowerCase());
    formData.append("content", content);
    formData.append("is_notified", isNotified ? "1" : "0");
    formData.append("is_urgent", isUrgent ? "1" : "0");

    // Handle images differently for create vs update
    if (isEditMode) {
      // For updates, separate new files from existing URLs
      const newFiles = images.filter(image => image instanceof File);
      const existingUrls = images.filter(image => typeof image === 'string');
      
      // Only append new files to FormData
      newFiles.forEach((image) => formData.append("images[]", image));
      
      // Send existing URLs separately
      if (existingUrls.length > 0) {
        formData.append("existing_images", JSON.stringify(existingUrls));
      }
    } else {
      // For creates, all images should be files
      images.forEach((image) => formData.append("images[]", image));
    }

    // Status logic: If urgent, always send 'published', otherwise send the action
    const statusToSend = isUrgent ? "published" : action;
    formData.append("status", statusToSend);

    return formData;
  };

  // Handle CREATE operations
  const handleCreatePost = async (action) => {
    if (!validateForm()) return;

    setStatus((prev) => ({ ...prev, [action]: true }));
    setIsLoading(true);
    setError(null);

    try {
      const formData = prepareFormData(action);
      const response = await createPost(formData);

      await load();
      setPostId(response.id);

      if (closeModal) closeModal();
      if (onSuccess) onSuccess(action);

      if (isUrgent) {
        toast.success("Urgent post published immediately!");
        console.log("Urgent post published immediately!");
      } else {
        toast.success("Post created successfully!");
        console.log("Post created successfully!");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post!");
      setError(err.response?.data?.message || "Failed to create post!");
    } finally {
      setIsLoading(false);
      setStatus((prev) => ({ ...prev, [action]: false }));
    }
  };

  // Handle UPDATE operations
  const handleUpdatePost = async (action) => {
    if (!validateForm()) return;

    // Debug: Log the current post status and ID
    console.log('Current post status:', existingPost?.status);
    console.log('Post ID:', postId);
    console.log('Existing post ID:', existingPost?.id);
    console.log('Can edit statuses:', ['draft', 'revision']);

    // Check if post can be updated (only draft or revision status)
    if (existingPost?.status && !['draft', 'revision'].includes(existingPost.status)) {
      toast.error(`Cannot edit post with status: ${existingPost.status}. Only draft or revision posts can be edited.`);
      return;
    }

    setStatus((prev) => ({ ...prev, [action]: true }));
    setIsLoading(true);
    setError(null);

    try {
      const formData = prepareFormData(action);
      const response = await updatePost(postId, formData);

      await load();

      if (closeModal) closeModal();
      if (onSuccess) onSuccess(action);

      if (isUrgent) {
        toast.success("Urgent post updated and published immediately!");
        console.log("Urgent post updated and published immediately!");
      } else {
        toast.success("Post updated successfully!");
        console.log("Post updated successfully!");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update post!");
      setError(err.response?.data?.message || "Failed to update post!");
    } finally {
      setIsLoading(false);
      setStatus((prev) => ({ ...prev, [action]: false }));
    }
  };

  // Main submit handler - routes to create or update
  const handleSubmit = async (e, action) => {
    e.preventDefault();
    
    if (isEditMode) {
      await handleUpdatePost(action);
    } else {
      await handleCreatePost(action);
    }
  };

  // Check if current post status allows editing
  const canEdit = !isEditMode || !existingPost?.status || ['draft', 'revision'].includes(existingPost.status);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <button onClick={closeModal} className="text-xl text-[#1A2B50] hover:text-gray-600">
          <IoArrowBack />
        </button>
        <h2 className="text-xl font-semibold text-[#20C1FB] flex-grow text-center">
          {isEditMode ? "Edit School Updates" : "Create New School Updates"}
        </h2>
      </div>

      {/* Show warning if post cannot be edited */}
      {isEditMode && !canEdit && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          This post cannot be edited as it has already been submitted or published.
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex items-center justify-between">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="select-dropdown"
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
        className="w-full p-2 border rounded-md"
        disabled={!canEdit}
      />

      <TextEditor 
        content={content} 
        setContent={setContent} 
        setImages={setImages}
        disabled={!canEdit}
      />

      {canEdit && (
        <div className="mt-4 flex space-x-2 justify-end">
          <button
            type="button"
            disabled={status.draft || isLoading}
            onClick={(e) => handleSubmit(e, "draft")}
            className={`px-4 py-2 rounded ${
              status.draft || isLoading 
                ? "bg-gray-600 cursor-not-allowed" 
                : "bg-gray-500 hover:bg-gray-600 cursor-pointer"
            } text-white`}
          >
            {status.draft ? "Saving..." : `${isEditMode ? "Update" : "Save"} as Draft`}
          </button>

          {!isUrgent && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setConfirmAction("pending");
                setShowConfirmation(true);
              }}
              className="px-4 py-2 rounded bg-blue-800 hover:bg-blue-600 text-white cursor-pointer disabled:bg-blue-600 disabled:cursor-not-allowed"
            >
              {isEditMode ? "Update &" : ""} Submit for Approval
            </button>
          )}

          {isUrgent && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setConfirmAction("published");
                setShowConfirmation(true);
              }}
              className="px-4 py-2 rounded bg-green-800 hover:bg-green-600 text-white cursor-pointer disabled:bg-green-600 disabled:cursor-not-allowed"
            >
              {isEditMode ? "Update &" : ""} Publish
            </button>
          )}

          <InfoModal
            isOpen={showConfirmation}
            closeModal={() => setShowConfirmation(false)}
            title={
              confirmAction === "pending" 
                ? `${isEditMode ? "Update &" : ""} Submit for Approval` 
                : `${isEditMode ? "Update &" : ""} Publish Post`
            }
            description={`Are you sure you want to ${
              confirmAction === "pending" 
                ? `${isEditMode ? "update and " : ""}submit this post for approval` 
                : `${isEditMode ? "update and " : ""}publish this post`
            }?`}
          >
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              onClick={(e) => {
                handleSubmit(e, confirmAction);
                setShowConfirmation(false);
              }}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm"}
            </button>
          </InfoModal>
        </div>
      )}

      {!canEdit && (
        <div className="mt-4 text-center text-gray-500">
          This post is in "{existingPost?.status}" status and cannot be modified.
        </div>
      )}
    </div>
  );
};


export default CreatePostForm;