import API from "../utils/api";

// --- REGISTER USER ---
export const registerUser = async (userData) => {
    const response = await API.post("/api/auth/register", userData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// --- LOGIN USER ---
export const loginUser = async (credentials) => {
    const response = await API.post("/api/auth/login", credentials);
    return response.data;
};

// --- GET READING GOAL ---
export const getReadingGoal = async () => {
    const response = await API.get("/api/auth/reading-goal");
    return response.data;
};

// --- SET/UPDATE READING GOAL ---
export const setReadingGoal = async (goalData) => {
    const response = await API.put("/api/auth/reading-goal", goalData);
    return response.data;
};