import axios from "axios";

// export const baseURL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // ⬅ Ensures cookies are sent with requests

});


export const getPosts = async () => {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Something went wrong!";
  }
};
export const getArchivePosts = async () => {
  try {
    const response = await api.get("/posts/archive");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Something went wrong!";
  }
};

export const getPostById = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;

  } catch (error) {
    throw error.response?.data || "Something went wrong!";
  }
}

export const uploadImages = async (imageFiles) => {
  const formData = new FormData();

  // Wrap the single image in an array 
  const filesToUpload = Array.isArray(imageFiles) ? imageFiles : [imageFiles];

  // Add each image file to the FormData object
  filesToUpload.forEach((file) => formData.append('images[]', file));

  try {
    const response = await api.post("/upload-images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.image_urls; // Return the image URLs
  } catch (error) {
    console.error("Image upload failed", error);
    throw error;
  }
};

export const createPost = async (formData) => {
  try {

    const response = await api.post("/posts", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Something went wrong!";
  }
};

export const updatePost = async (id, formData) => {
  try {
    const response = await api.put(`/posts/${id}`, formData);

    return response.data;
  } catch (error) {
    throw error.response?.data || "Something went wrong!";
  }
};

export const publishPost = (id, syncWithFacebook) =>
  api.post(`/posts/${id}/publish`, { post_to_facebook: syncWithFacebook });

// Sync post to Facebook (Only if status === "approved")
export const syncToFacebook = async (post) => {
  if (post.status !== "approved") return;

  const response = await api.post("/facebook-sync", {
    title: post.title,
    content: post.content,
    image_url: post.image_url ? JSON.parse(post.image_url) : [],
  });

  return response.data;
};

export const submitPost = (id) => api.post(`/posts/${id}/submit`);

export const archivePost = (id) => api.post(`/posts/${id}/archive`);
export const restorePost = (id) => api.post(`/posts/${id}/restore`);
export const deletePost = (id) => api.post(`/posts/${id}/destroy`);
export const approvePost = (id) => api.post(`/posts/${id}/approve`);
export const rejectPost = (id) => api.post(`/posts/${id}/reject`);

export const requestRevision = async (id, revisionFields, revisionRemarks) => {
  await api.post(`/posts/${id}/status`, {
    status: "for_revision",
    revision_fields: revisionFields,
    revision_remarks: revisionRemarks,
  });
};

export const getPublishedPosts = () => api.get('/posts/published');



export default api;