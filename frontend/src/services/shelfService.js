import API from "../utils/api";

// --- ADD TO SHELF ---
export const addToShelf = async (shelfData) => {
    const response = await API.post("/api/shelves", shelfData);
    return response.data;
};

// --- GET USER SHELVES ---
export const getUserShelves = async () => {
    const response = await API.get("/api/shelves");
    return response.data;
};

// --- UPDATE PROGRESS ---
export const updateProgress = async (shelfId, progressData) => {
    const response = await API.put(`/api/shelves/${shelfId}/progress`, progressData);
    return response.data;
};

// --- REMOVE FROM SHELF ---
export const removeFromShelf = async (shelfId) => {
    const response = await API.delete(`/api/shelves/${shelfId}`);
    return response.data;
};

// --- GET USER STATS ---
export const getUserStats = async () => {
    const response = await API.get("/api/shelves/stats");
    return response.data;
};