import { useEffect, useState } from "react";
import { fetchPosts } from "../../axios";
import { useAuthContext } from "../context/AuthContext";
import PostItem from "../../components/school_updates/PostItem";

const Posts = () => {
  const { user } = useAuthContext();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => <PostItem key={post.id} post={post} />)
      )}
    </div>
  );
};

export default Posts;
