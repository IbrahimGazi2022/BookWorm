import API from "../utils/api";

// --- CREATE GENRE ---
export const createGenre = async (genreData) => {
    const response = await API.post("/api/genres", genreData);
    return response.data;
};

// --- GET ALL GENRES ---
export const getAllGenres = async () => {
    const response = await API.get("/api/genres");
    return response.data;
};

// --- UPDATE GENRE ---
export const updateGenre = async (id, genreData) => {
    const response = await API.put(`/api/genres/${id}`, genreData);
    return response.data;
};

// --- DELETE GENRE ---
export const deleteGenre = async (id) => {
    const response = await API.delete(`/api/genres/${id}`);
    return response.data;
};