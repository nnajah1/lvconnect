export default function SchoolUpdateRevision() {
    const [revisionFields, setRevisionFields] = useState([]);

    const handleFieldChange = (field, remark) => {
        setRevisionFields((prev) => ({
            ...prev,
            [field]: remark, // Store field with remark
        }));
    };
    
    const handleSendForRevision = async () => {
        try {
            await axios.post(`/posts/${postId}/status`, {
                status: "for_revision",
                revision_fields: revisionFields,
            });
            alert("Post sent for revision!");
        } catch (error) {
            console.error(error);
        }
    };
    
    return(
         // UI Example: Select fields & add remarks
        <div>
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
                    delete newFields[field]; // Remove field
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
        {post.status === "for_revision" && post.revision_fields && (
        <div>
            <h3>Fields that need revision:</h3>
            <ul>
            {Object.entries(post.revision_fields).map(([field, remark]) => (
                <li key={field}>
                <strong>{field}:</strong> {remark}
                </li>
            ))}
            </ul>
        </div>
        )}

    </div>
    )
   
    
};


