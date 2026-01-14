import api from "../utils/api";

// --- GET ALL TUTORIALS ---
export const getAllTutorials = async () => {
    const response = await api.get("/api/tutorials");
    return response.data;
};

// --- GET SINGLE TUTORIAL ---
export const getTutorialById = async (id) => {
    const response = await api.get(`/api/tutorials/${id}`);
    return response.data;
};

// --- CREATE TUTORIAL ---
export const createTutorial = async (tutorialData) => {
    const response = await api.post("/api/tutorials", tutorialData);
    return response.data;
};

// --- UPDATE TUTORIAL ---
export const updateTutorial = async (id, tutorialData) => {
    const response = await api.put(`/api/tutorials/${id}`, tutorialData);
    return response.data;
};

// --- DELETE TUTORIAL ---
export const deleteTutorial = async (id) => {
    const response = await api.delete(`/api/tutorials/${id}`);
    return response.data;
};