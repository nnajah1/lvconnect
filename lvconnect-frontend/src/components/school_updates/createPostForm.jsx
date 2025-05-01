import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import SwitchComponent from "@/components/school_updates/modals/switch";
import TooltipComponent from "@/components/school_updates/modals/tooltip";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { createPost, updatePost, publishPost, syncToFacebook } from "@/services/axios"; // Import API function
import TextEditor from "@/components/school_updates/textEditor"; // Quill Editor


const CreatePostForm = ({ closeModal, existingPost, onSuccess }) => {
  const [selectedType, setSelectedType] = useState("announcement");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // Holds ReactQuill editor content
  const [images, setImages] = useState([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [syncWithFacebook, setSyncWithFacebook] = useState(false);
  const [postId, setPostId] = useState(existingPost?.id || null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);



  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {

      const formData = new FormData();

      formData.append("title", title);
      if (selectedType) {
        formData.append("type", selectedType.toLowerCase());
      }
      formData.append("status", status);
      formData.append("isUrgent", isUrgent ? "1" : "0");
      formData.append("syncWithFacebook", syncWithFacebook ? "1" : "0");



      images.forEach((image) => {
        formData.append("images[]", image);
      });



      if (!content || content?.trim() === "<p><br></p>") {

        setError("Please fill out all required fields.");
        setIsLoading(false);
        return;
      }

      const cleanContent = (html) => {
        const cleaned = html
          .replace(/<img[^>]*>/g, "")                           // Remove <img>
          .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")     // Remove empty <p>
          .replace(/\s+/g, " ");                                // Collapse whitespace

        return cleaned.trim() === "" ? "<p><br></p>" : cleaned.trim();
      };

      formData.append("content", cleanContent(content));



      // Send to Laravel
      const response = postId
        ? await updatePost(postId, formData)
        : await createPost(formData);

      if (!postId) setPostId(response.id);

      // Sync to Facebook ONLY if approved
      // if (status === "approved" && postId) {
      //   await syncToFacebook({
      //     title: formData.get("title"),
      //     content: formData.get("content"),
      //     images: uploadedImageUrls,
      //   });
      // }

      if (onSuccess) onSuccess(status);
    } catch (err) {
      setError(err.response?.data || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!postId) {
      setSuccess("Post must be approved first!");
      return;
    }

    try {
      const response = await publishPost(postId, syncWithFacebook);

      if (response.data.facebook_post_id) {
        setSuccess("Post published and shared on Facebook!");
      } else {
        setSuccess("Post published successfully!");
      }
    } catch (err) {
      setError("Failed to publish post");
    }
  };

  return (
    <div
      className="flex flex-col gap-2"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={closeModal}
          className="text-xl text-[#1A2B50] hover:text-gray-600 focus:outline-none cursor-pointer"
          aria-label="Go back"
        >
          <IoArrowBack />
        </button>
        <h2 className="text-xl font-semibold text-[#20C1FB] flex-grow text-center">Create New School Updates</h2>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex items-center justify-between">
        {/* Type Selection */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="select-dropdown"
        >
          <option value="announcement" className="select-option">Announcement</option>
          <option value="event" className="select-option">Event</option>
        </select>


        <div className="flex items-center gap-2">
          {/* Urgent Toggle */}
          <SwitchComponent
            label="Notification"
            checked={isUrgent}
            onCheckedChange={setIsUrgent}
          />
          <TooltipComponent text="notipikasyon"><BsFillInfoCircleFill className="tooltip-icon" size={14} /></TooltipComponent>
        </div>
      </div>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-md text-lg bg-white focus:outline-none focus:border-[#2CA4DD]"
      />

      <TextEditor content={content} setContent={setContent} setImages={setImages} />

      <div className="flex items-center justify-between">
        {/* Facebook Sync Toggle */}
        <div className="flex gap-2">
          <SwitchComponent
            label="Sync with Facebook"
            checked={syncWithFacebook}
            onCheckedChange={setSyncWithFacebook}
          />
          <TooltipComponent text="Sync posts with Facebook"><BsFillInfoCircleFill className="tooltip-icon" size={14} /></TooltipComponent>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={(e) => handleSubmit(e, "draft")}
            className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md">
            Save as Draft
          </button>
          <button
            onClick={(e) => handleSubmit(e, "pending")}
            className="px-3 py-1 bg-[#2CA4DD] hover:bg-[#1e90d9] text-white rounded-md">
            Submit
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {/* {isLoading &&  <LoadingPage />} */}
    </div>
  );
};

export default CreatePostForm;