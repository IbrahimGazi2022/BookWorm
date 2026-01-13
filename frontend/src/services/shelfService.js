import API from "../utils/api";

export const addToShelf = async (shelfData) => {
    const response = await API.post("/api/shelves", shelfData);
    return response.data;
};

export const getUserShelves = async () => {
    const response = await API.get("/api/shelves");
    return response.data;
};

export const updateProgress = async (shelfId, progressData) => {
    const response = await API.put(`/api/shelves/${shelfId}/progress`, progressData);
    return response.data;
};

export const removeFromShelf = async (shelfId) => {
    const response = await API.delete(`/api/shelves/${shelfId}`);
    return response.data;
};

export const getUserStats = async () => {
    const response = await API.get("/api/shelves/stats");
    return response.data;
};