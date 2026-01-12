import express from "express";
import {
    createReview,
    getAllReviews,
    getPendingReviews,
    approveReview,
    deleteReview,
    getApprovedReviewsByBook,
} from "../controllers/reviewController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// USER ROUTES
router.post("/", protect, createReview);
router.get("/book/:bookId", getApprovedReviewsByBook);

// ADMIN ROUTES
router.get("/", protect, adminOnly, getAllReviews);
router.get("/pending", protect, adminOnly, getPendingReviews);
router.put("/:reviewId/approve", protect, adminOnly, approveReview);
router.delete("/:reviewId", protect, adminOnly, deleteReview);

export default router;