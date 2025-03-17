import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, approvePost, sendForRevision } from "../../axios";

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [revisionFields, setRevisionFields] = useState({});

  useEffect(() => {
    fetchPostById(id).then(setPost);
  }, [id]);

  const handleApprove = async () => {
    await approvePost(id);
    alert("Post approved!");
    navigate("/review");
  };

  const handleFieldChange = (field, remark) => {
    setRevisionFields((prev) => ({
      ...prev,
      [field]: remark,
    }));
  };

  const handleSendForRevision = async () => {
    await sendForRevision(id, revisionFields);
    alert("Post sent for revision!");
    navigate("/review");
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h2>Review Post: {post.title}</h2>
      <p>{post.content}</p>
      <h3>Request Revisions</h3>
      {["title", "content", "image"].map((field) => (
        <div key={field}>
          <label>
            <input
              type="checkbox"
              checked={revisionFields.hasOwnProperty(field)}
              onChange={(e) => {
                if (e.target.checked) {
                  handleFieldChange(field, ""); // Add empty remark
                } else {
                  const newFields = { ...revisionFields };
                  delete newFields[field];
                  setRevisionFields(newFields);
                }
              }}
            />
            {field}
          </label>
          {revisionFields[field] !== undefined && (
            <input
              type="text"
              placeholder="Enter remarks..."
              value={revisionFields[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
            />
          )}
        </div>
      ))}
      <button onClick={handleSendForRevision}>Send for Revision</button>
      <button onClick={handleApprove}>Approve</button>
      <button onClick={() => navigate("/review")}>Back</button>
    </div>
  );
};

export default ReviewDetails;
