import { useEffect, useState } from "react";
import { fetchPosts, submitForApproval, deletePost, approvePost, requestRevision, publishPost } from "../../axios";
import PostItem from "./PostItem";
import { useAuthContext } from "../context/AuthContext";

const PostList = () => {
  const { user } = useAuthContext();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
