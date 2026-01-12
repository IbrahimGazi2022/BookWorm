import Review from "../models/reviewModel.js";
import Book from "../models/bookModel.js";

// CREATE REVIEW (USER)
export const createReview = async (req, res) => {
    try {
        const { bookId, rating, comment } = req.body;

        if (!bookId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // CHECK IF USER ALREADY REVIEWED THIS BOOK
        const existingReview = await Review.findOne({
            book: bookId,
            user: req.user._id,
        });

        if (existingReview) {
            return res.status(409).json({ message: "You already reviewed this book" });
        }

        const review = await Review.create({
            book: bookId,
            user: req.user._id,
            rating,
            comment,
        });

        res.status(201).json({
            message: "Review submitted successfully",
            review,
        });
    } catch (error) {
        console.error("Create Review Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET ALL REVIEWS (ADMIN)
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate("user", "name email photo")
            .populate("book", "title coverImage")
            .sort({ createdAt: -1 });

        res.status(200).json({ reviews });
    } catch (error) {
        console.error("Get Reviews Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET PENDING REVIEWS (ADMIN)
export const getPendingReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ status: "Pending" })
            .populate("user", "name email photo")
            .populate("book", "title coverImage")
            .sort({ createdAt: -1 });

        res.status(200).json({ reviews });
    } catch (error) {
        console.error("Get Pending Reviews Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// APPROVE REVIEW (ADMIN)
export const approveReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { status: "Approved" },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({
            message: "Review approved successfully",
            review,
        });
    } catch (error) {
        console.error("Approve Review Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE REVIEW (ADMIN)
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByIdAndDelete(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Delete Review Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET APPROVED REVIEWS BY BOOK (PUBLIC)
export const getApprovedReviewsByBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const reviews = await Review.find({
            book: bookId,
            status: "Approved",
        })
            .populate("user", "name photo")
            .sort({ createdAt: -1 });

        res.status(200).json({ reviews });
    } catch (error) {
        console.error("Get Book Reviews Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};