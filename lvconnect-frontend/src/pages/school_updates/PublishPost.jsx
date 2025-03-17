import { useEffect, useState } from "react";
import { fetchPosts, updatePost } from "../../axios";
import PostItem from "../../components/school_updates/PostItem";

const PublishPost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts("approved").then(setPosts);
  }, []);

  const handlePublish = async (id) => {
    await updatePost(id, { status: "published" });
    alert("Post published successfully");
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div>
      <h1>Publish Posts</h1>
      {posts.length === 0 ? (
        <p>No approved posts.</p>
      ) : (
        posts.map((post) => <PostItem key={post.id} post={post} onPublish={() => handlePublish(post.id)} />)
      )}
    </div>
  );
};

export default PublishPost;
