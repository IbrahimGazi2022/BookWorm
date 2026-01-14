import API from "../utils/api";

// --- CREATE BOOK ---
export const createBook = async (bookData) => {
    const response = await API.post("/api/books", bookData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// --- GET ALL BOOKS ---
export const getAllBooks = async () => {
    const response = await API.get("/api/books");
    return response.data;
};

// --- GET BOOK BY ID ---
export const getBookById = async (id) => {
    const response = await API.get(`/api/books/${id}`);
    return response.data;
};

// --- UPDATE BOOK ---
export const updateBook = async (id, bookData) => {
    const response = await API.put(`/api/books/${id}`, bookData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// --- DELETE BOOK ---
export const deleteBook = async (id) => {
    const response = await API.delete(`/api/books/${id}`);
    return response.data;
};

// --- GET RECOMMENDATIONS ---
export const getRecommendations = async () => {
    const response = await API.get("/api/books/recommendations");
    return response.data;
};

// --- GET ADMIN STATS ---
export const getAdminStats = async () => {
    const response = await API.get("/api/books/admin-stats");
    return response.data;
};