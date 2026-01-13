import API from "../utils/api";

export const createBook = async (bookData) => {
    const response = await API.post("/api/books", bookData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getAllBooks = async () => {
    const response = await API.get("/api/books");
    return response.data;
};

export const getBookById = async (id) => {
    const response = await API.get(`/api/books/${id}`);
    return response.data;
};

export const updateBook = async (id, bookData) => {
    const response = await API.put(`/api/books/${id}`, bookData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const deleteBook = async (id) => {
    const response = await API.delete(`/api/books/${id}`);
    return response.data;
};

export const getRecommendations = async () => {
    const response = await API.get("/api/books/recommendations");
    return response.data;
};

export const getAdminStats = async () => {
    const response = await API.get("/api/books/admin-stats");
    return response.data;
};