import axios from "axios";

// export const baseURL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
    const response = await api.get("/archive");
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

export const uploadImages = async (uploadForm) => {
  try {
    await api.post("/upload-images", uploadForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

export const createPost = async (formData) => {
  try {
    const response = await api.post("/posts", formData, {headers: {
        'Content-Type': 'multipart/form-data',
      },});
    return response.data;
  } catch (error) {
    throw error.response?.data || "Something went wrong!";
  }
};

export const updatePost = async (id, formData) => {
  formData.append('_method', 'PUT');  
  try {
    const response = await api.post(`/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });  
    return response.data;
  } catch (error) {
    throw error.response?.data || "Something went wrong!";
  }
};

// export const publishPost = async (id, formData) => {
//   try {
//     const response = await api.post(`/posts/${id}/publish`, formData);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || "Something went wrong!";
//   }
// };

export const archivePost = (id) => api.post(`/posts/${id}/archive`);
export const restorePost = (id) => api.post(`/posts/${id}/restore`);
export const deletePost = (id) => api.delete(`/posts/${id}/delete`);
export const fbPost = (id) => api.post(`/posts/${id}/facebook-sync`);

export const publishPost = (id) => api.post(`/posts/${id}/publish`);
export const submitPost = (id) => api.post(`/posts/${id}/submit`);
export const approvePost = (id) => api.post(`/posts/${id}/approve`);
export const rejectPost = (id, data) => api.post(`/posts/${id}/reject`, data);
export const revisionPost = (id, data) => api.post(`/posts/${id}/revision`, data);

export const requestRevision = async (id, revisionFields, revisionRemarks) => {
  await api.post(`/posts/${id}/status`, {
    status: "for_revision",
    revision_fields: revisionFields,
    revision_remarks: revisionRemarks,
  });
};

export const getPublishedPosts = () => api.get('/posts/published');

export function switchRole(role) {
  return api.post("/switch-role", { role });
}

export default api;