import API from "../utils/api";

export const registerUser = async (userData) => {
    const response = await API.post("/api/auth/register", userData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await API.post("/api/auth/login", credentials);
    return response.data;
};