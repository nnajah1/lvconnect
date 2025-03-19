

export default function SchoolUpdates() {
    const handleSaveDraft = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("type", type); 
        if (image) {
            formData.append("image", image);
        }
    
        
        
        try {
            await axios.post("/posts", formData);
            alert("Draft saved!");
        } catch (error) {
            console.error(error);
        }
    };
    const submitForApproval = async (postId) => {
        try {
            await axios.post(`/posts/${postId}/submit`);
            alert("Submitted for approval!");
        } catch (error) {
            console.error(error);
        }
    };
    const approvePost = async (postId) => {
        try {
            await axios.post(`/posts/${postId}/approve`);
            alert("Post approved!");
        } catch (error) {
            console.error(error);
        }
    };
    
    const rejectPost = async (postId) => {
        try {
            await axios.post(`/posts/${postId}/reject`);
            alert("Post rejected!");
        } catch (error) {
            console.error(error);
        }
    };
    
    const requestRevision = async (postId) => {
        try {
            await axios.post(`/posts/${postId}/request-revision`);
            alert("Post moved for revision!");
        } catch (error) {
            console.error(error);
        }
    };
    return (
        
        <div>
            <form onSubmit={handleSubmit}>
            
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="announcement">Announcement</option>
                    <option value="event">Event</option>
                </select>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required></textarea>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit">Create Post</button>
            </form>
            
        </div>

    )
    // Save for fetch type
    // const fetchPosts = async (type) => {
    //     try {
    //         const response = await axios.get(`/posts?type=${type}`);
    //         setPosts(response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    
    // // Example usage
    // fetchPosts("announcement"); // Fetch announcements
    // fetchPosts("event"); // Fetch events
}