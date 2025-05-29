import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import SwitchComponent from "@/components/dynamic/switch";
import TooltipComponent from "@/components/dynamic/tooltip";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { createPost, updatePost, publishPost } from "@/services/axios"; // Import API function
import TextEditor from "@/components/school_updates/textEditor"; // Quill Editor
import { toast } from "react-toastify";


const EditPostForm = ({ post, onSuccess }) => {
  const [selectedType, setSelectedType] = useState(post?.type || 'announcement');
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [images, setImages] = useState([]); // For new uploads
  const [isUrgent, setIsUrgent] = useState(post?.is_urgent === 1);
  const [isNotified, setIsNotified] = useState(post?.is_notified === 1);
  // const [syncWithFacebook, setSyncWithFacebook] = useState(post?.post_to_facebook === 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isUrgent) {
      setIsNotified(true);
    }
  }, [isUrgent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', selectedType.toLowerCase());
      formData.append('is_notified', isNotified ? '1' : '0');
      formData.append('is_urgent', isUrgent ? '1' : '0');
      // formData.append('post_to_facebook', syncWithFacebook ? '1' : '0');

      // Append new images if any
      images.forEach((image) => formData.append('images[]', image));

      // Clean content
      const cleanContent = (html) => {
        const cleaned = html
          .replace(/<img[^>]*>/g, '')
          .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
          .replace(/\s+/g, ' ');
        return cleaned.trim() === '' ? '<p><br></p>' : cleaned.trim();
      };
      formData.append('content', cleanContent(content));

      await updatePost(post.id, formData);
      toast.success('Post updated successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold text-[#20C1FB]">Edit School Update</h2>

      <div className="flex items-center justify-between">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="select-dropdown"
        >
          <option value="announcement" className="select-option">Announcement</option>
          <option value="event" className="select-option">Event</option>
        </select>

        <div className="flex items-center gap-2">
          <SwitchComponent
            label="Urgent"
            checked={isUrgent}
            onCheckedChange={() => setIsUrgent((prev) => !prev)}
          />
          <TooltipComponent text="Notification"><BsFillInfoCircleFill size={14} /></TooltipComponent>
        </div>
        <div className="flex items-center gap-2">
          <SwitchComponent
            label="Notification"
            checked={isNotified}
            onCheckedChange={() => {
              if (!isUrgent) setIsNotified((prev) => !prev);
            }}
          />
          <TooltipComponent text="Urgent"><BsFillInfoCircleFill size={14} /></TooltipComponent>
        </div>
      </div>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-md text-lg bg-white focus:outline-none focus:border-[#2CA4DD]"
      />

      <TextEditor content={content} setContent={setContent} setImages={setImages} />

      {/* Show existing images */}
      {post.image_url && JSON.parse(post.image_url).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {JSON.parse(post.image_url).map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Existing ${idx}`}
              className="w-[20rem] object-contain rounded"
            />
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="px-4 py-2 bg-[#2CA4DD] hover:bg-[#1e90d9] text-white rounded-md"
      >
        {isLoading ? 'Updating...' : 'Update Post'}
      </button>
    </div>
  );
};

export default EditPostForm;

  