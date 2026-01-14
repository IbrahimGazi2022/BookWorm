import api from "../utils/api";

// --- CREATE REVIEW ---
export const createReview = async (bookId, rating, comment) => {
    const response = await api.post("/api/reviews", { bookId, rating, comment });
    return response.data;
};

// --- GET ALL REVIEWS ---
export const getAllReviews = async () => {
    const response = await api.get("/api/reviews");
    return response.data;
};

// --- GET PENDING REVIEWS ---
export const getPendingReviews = async () => {
    const response = await api.get("/api/reviews/pending");
    return response.data;
};

// --- APPROVE REVIEW ---
export const approveReview = async (reviewId) => {
    const response = await api.put(`/api/reviews/${reviewId}/approve`);
    return response.data;
};

// --- DELETE REVIEW ---
export const deleteReview = async (reviewId) => {
    const response = await api.delete(`/api/reviews/${reviewId}`);
    return response.data;
};

// --- GET APPROVED REVIEWS BY BOOK ---
export const getApprovedReviewsByBook = async (bookId) => {
    const response = await api.get(`/api/reviews/book/${bookId}`);
    return response.data;
};