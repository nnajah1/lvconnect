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

export const createPost = async (payload) => {
  try {
    const response = await api.post("/posts", payload); 
    return response.data;
  } catch (error) {
    throw error.response?.data || "Something went wrong!";
  }
};

export const updatePost = async (id, payload) => {
  try {
    const response = await api.put(`/posts/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Something went wrong!";
  }
};


export const archivePost = (id) => api.post(`/posts/${id}/archive`);
export const restorePost = (id) => api.post(`/posts/${id}/restore`);
export const deletePost = (id) => api.delete(`/posts/${id}/delete`);
export const fbPost = (id, data) => api.post(`/posts/${id}/facebook-sync`, data);

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

export const uploadToSupabase = async (files) => {
  const formData = new FormData();
  const fileArray = Array.isArray(files) ? files : [files];

  fileArray.forEach((file) => {
    formData.append("file[]", file);
  });

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.paths;
};

export const getSignedUrl = async (path) => {
  try {
    if (!path) return null;
    const res = await api.post('/generate-signed-url', { path });
    return res.data.signed_url;
  } catch (error) {
    console.error('Failed to generate signed URL:', error);
    return null;
  }
};

export const getClassSchedule = async () => {
  try {
    const response = await api.get("/class-schedule");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Something went wrong!";
  }
};

export const getGrades = async () => {
  try {
    const response = await api.get("/grades");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Something went wrong!";
  }
};

export const fetchNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data; 
};

export const markAllAsRead = async () => {
  await api.post('/notifications/mark-as-read');
};

export const markOneAsRead = async (id) => {
  await api.post(`/notifications/${id}/read`);
};

export default api;