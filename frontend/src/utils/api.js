import axios from "axios";

// --- AXIOS INSTANCE CONFIGURATION ---
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// --- REQUEST INTERCEPTOR (TOKEN INJECTION) ---
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;