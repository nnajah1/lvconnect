import { useState } from "react";
import { createPost } from "../../axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "", type: "announcement", image: null });

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setPost({ ...post, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
        formData.append("type", post.type);
        formData.append("title", post.title);
        formData.append("content", post.content);
        formData.append("image", post.image);
    await createPost(post);
    alert("Post created successfully");
    navigate("/posts");
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
      <select name="type" onChange={handleChange}>
          <option value="announcement">Announcement</option>
          <option value="event">Event</option>
        </select>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="content" placeholder="Content" onChange={handleChange} required></textarea>
        <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
        <button type="submit">Save Draft</button>
      </form>
    </div>
  );
};

export default CreatePost;
