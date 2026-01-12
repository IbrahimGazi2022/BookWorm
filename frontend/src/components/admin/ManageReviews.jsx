import React, { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, XCircle, Star, Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getPendingReviews, approveReview, deleteReview } from "../../services/reviewService";

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await getPendingReviews();
            setReviews(data.reviews);
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (reviewId) => {
        if (!window.confirm("Are you sure you want to approve this review?")) {
            return;
        }

        try {
            setActionLoading(reviewId);
            await approveReview(reviewId);
            toast.success("Review approved successfully");
            fetchReviews();
        } catch (error) {
            toast.error("Failed to approve review");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }

        try {
            setActionLoading(reviewId);
            await deleteReview(reviewId);
            toast.success("Review deleted successfully");
            fetchReviews();
        } catch (error) {
            toast.error("Failed to delete review");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-secondary" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-8 h-8 text-secondary" />
                <h1 className="text-3xl font-bold text-gray-800">Review Moderation</h1>
            </div>

            {/* PENDING COUNT */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <p className="text-yellow-700 font-semibold">
                    {reviews.length} Pending Review{reviews.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* REVIEWS LIST */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex gap-4">
                            {/* BOOK COVER */}
                            <img
                                src={`${import.meta.env.VITE_API_URL}/${review.book.coverImage}`}
                                alt={review.book.title}
                                className="w-20 h-28 object-cover rounded-lg"
                            />

                            {/* REVIEW CONTENT */}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {review.book.title}
                                </h3>

                                {/* USER INFO */}
                                <div className="flex items-center gap-2 mb-3">
                                    <img
                                        src={review.user.photo.startsWith('http')
                                            ? review.user.photo
                                            : `${import.meta.env.VITE_API_URL}/${review.user.photo}`
                                        }
                                        alt={review.user.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">
                                            {review.user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* RATING */}
                                <div className="flex items-center gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${star <= review.rating
                                                ? "text-yellow-500 fill-yellow-500"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* COMMENT */}
                                <p className="text-gray-700 mb-4">{review.comment}</p>

                                {/* ACTION BUTTONS */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleApprove(review._id)}
                                        disabled={actionLoading === review._id}
                                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                                    >
                                        {actionLoading === review._id ? (
                                            <Loader className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-5 h-5" />
                                        )}
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        disabled={actionLoading === review._id}
                                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No pending reviews</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageReviews;