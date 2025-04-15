import { useEffect, useState } from "react";
import { getPosts } from "@/services/axios";
import PostItem from "@/components/school_updates/PostForm";

const ReviewPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts("submitted").then(setPosts);
  }, []);

  return (
    <div>
      <h1>Review Posts</h1>
      {posts.length === 0 ? <p>No posts for review.</p> : posts.map((post) => <PostItem key={post.id} post={post} />)}
    </div>
  );
};

export default ReviewPosts;
