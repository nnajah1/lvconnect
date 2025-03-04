import axios from "axios";

// export const baseURL = "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true, // ⬅ Ensures cookies are sent with requests
   headers: {
        'Content-Type': 'application/json',
    },
});


export default api;