import axios from "axios";

// export const baseURL = "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true, // ⬅ Ensures cookies are sent with requests
    headers: { "Content-Type": "application/json" }
});

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         if (error.response?.status === 401) {
//             console.warn("Unauthorized, trying refresh...");
//             await refreshToken();
//             return api(error.config); // Retry failed request
//         }
//         return Promise.reject(error);
//     }
// );

export const fetchPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};
export const fetchPostById = async (id) => {
  const response = await axios.get(`/posts/${id}`);
  return response.data;
};
export const createPost = (data) => api.post("/posts", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const submitForApproval = (id) => api.post(`/posts/${id}/submit`);
export const approvePost = async (id) => {
  await axios.post(`/posts/${id}/status`, { status: "approved" });
};
export const publishPost = (id) => api.post(`/posts/${id}/status`, { status: "published" });
export const rejectPost = (id) => api.post(`/posts/${id}/status`, { status: "rejected" });
export const sendForRevision = async (id, revisionFields) => {
  await axios.post(`/posts/${id}/status`, {
    status: "for_revision",
    revision_fields: revisionFields,
  });
};

export default api;