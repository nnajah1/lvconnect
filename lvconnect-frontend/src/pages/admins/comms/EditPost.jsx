import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPosts, updatePost } from "@/services/axios";
import { useAuthContext } from "@/context/AuthContext";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [post, setPost] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchPosts(id).then((data) => {
      if (data.status !== "draft") {
        alert("You cannot edit a submitted post.");
        navigate("/posts");
      }
      setPost(data);
    });
  }, [id, navigate]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePost(id, post);
    alert("Post updated successfully");
    navigate("/posts");
  };

  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={post.title} onChange={handleChange} />
        <textarea name="content" value={post.content} onChange={handleChange}></textarea>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditPost;
