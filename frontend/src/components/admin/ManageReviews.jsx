import React, { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, XCircle, Star, Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getPendingReviews, approveReview, deleteReview } from "../../services/reviewService";

// --- STAR RATING COMPONENT ---
const StarRating = ({ rating }) => (
    <div className="flex items-center gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={`w-4 h-4 md:w-5 md:h-5 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-200"
                    }`}
            />
        ))}
    </div>
);

// --- REVIEW CARD COMPONENT ---
const ReviewCard = ({ review, onApprove, onDelete, actionLoading }) => {
    const isProcessing = actionLoading === review._id;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">

                {/* BOOK COVER SECTION */}
                <div className="relative shrink-0 flex justify-center sm:block">
                    <img
                        src={`${import.meta.env.VITE_API_URL}/${review.book.coverImage}`}
                        alt={review.book.title}
                        className="w-24 h-32 md:w-28 md:h-40 object-cover rounded-xl shadow-sm"
                    />
                </div>

                {/* CONTENT SECTION */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
                            {review.book.title}
                        </h3>
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    {/* USER INFO SECTION */}
                    <div className="flex items-center gap-3 mb-4 bg-gray-50/50 p-2 rounded-xl border border-gray-50">
                        <img
                            src={review.user.photo.startsWith('http')
                                ? review.user.photo
                                : `${import.meta.env.VITE_API_URL}/${review.user.photo}`
                            }
                            alt={review.user.name}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                            <p className="text-sm font-bold text-gray-700">{review.user.name}</p>
                            <p className="text-[10px] md:text-xs text-gray-500">Verified Reader</p>
                        </div>
                    </div>

                    <StarRating rating={review.rating} />

                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 italic">
                        "{review.comment}"
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => onApprove(review._id)}
                            disabled={isProcessing}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm shadow-green-200"
                        >
                            {isProcessing ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <CheckCircle className="w-5 h-5" />
                            )}
                            Approve
                        </button>
                        <button
                            onClick={() => onDelete(review._id)}
                            disabled={isProcessing}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            <XCircle className="w-5 h-5" />
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN MANAGE REVIEWS COMPONENT ---
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
        if (!window.confirm("Approve this review for publication?")) return;
        try {
            setActionLoading(reviewId);
            await approveReview(reviewId);
            toast.success("Review is now live!");
            fetchReviews();
        } catch (error) {
            toast.error("Approval failed");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
        try {
            setActionLoading(reviewId);
            await deleteReview(reviewId);
            toast.success("Review removed");
            fetchReviews();
        } catch (error) {
            toast.error("Delete failed");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

            <div className="max-w-4xl mx-auto">
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 p-3 rounded-2xl">
                            <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Review Moderation</h1>
                            <p className="text-gray-500 text-sm">Control what users see in the library</p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl self-start md:self-center">
                        <p className="text-amber-700 font-bold text-sm">
                            {reviews.length} Action Needed
                        </p>
                    </div>
                </div>

                {/* CONTENT AREA */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <Loader className="w-10 h-10 animate-spin text-secondary" />
                        <p className="text-gray-400 font-medium animate-pulse">Loading pending reviews...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                onApprove={handleApprove}
                                onDelete={handleDelete}
                                actionLoading={actionLoading}
                            />
                        ))}

                        {reviews.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">Queue is Empty!</h3>
                                <p className="text-gray-400">All reviews have been moderated.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageReviews;