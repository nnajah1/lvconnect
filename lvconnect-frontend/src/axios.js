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

export default api;