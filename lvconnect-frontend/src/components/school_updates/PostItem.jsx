import { approvePost, requestRevision, submitForApproval, publishPost, deletePost } from "../api/posts";
import { useAuthContext } from "../context/AuthContext";

const PostItem = ({ post }) => {
  const { user } = useAuthContext();

  return (
    <div>
       { /*addimage*/}
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>Status: {post.status}</p>

      {/* Comms ADMIN: Edit, Delete, Submit for Approval */}
      {user.role === "comms" && post.status === "draft" && (
        <>
          <button onClick={() => submitForApproval(post.id)}>Submit for Approval</button>
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </>
      )}

      {/* School ADMIN: Approve or Request Revision */}
      {user.role === "scadmin" && post.status === "pending" && (
        <>
          <button onClick={() => approvePost(post.id)}>Approve</button>
          <button onClick={() => requestRevision(post.id)}>Request Revision</button>
        </>
      )}

      {/* Comms ADMIN: Publish an Approved Post */}
      {user.role === "comms" && post.status === "approved" && (
        <button onClick={() => publishPost(post.id)}>Publish</button>
      )}
    </div>
  );
};

export default PostItem;
