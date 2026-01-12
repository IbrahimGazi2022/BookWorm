import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, Loader, Send } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getBookById } from "../../services/bookService";
import { addToShelf } from "../../services/shelfService";
import { createReview, getApprovedReviewsByBook } from "../../services/reviewService";

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToShelf, setAddingToShelf] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

    useEffect(() => {
        fetchBook();
        fetchReviews();
    }, [id]);

    const fetchBook = async () => {
        try {
            setLoading(true);
            const data = await getBookById(id);
            setBook(data.book);
        } catch (error) {
            toast.error("Failed to fetch book details");
            navigate("/browse");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const data = await getApprovedReviewsByBook(id);
            setReviews(data.reviews);
        } catch (error) {
            console.error("Failed to fetch reviews");
        }
    };

    const handleAddToShelf = async (shelfType) => {
        try {
            setAddingToShelf(true);
            await addToShelf({ bookId: id, shelfType });
            toast.success(`Added to ${shelfType === "wantToRead" ? "Want to Read" : shelfType === "currentlyReading" ? "Currently Reading" : "Read"}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to shelf");
        } finally {
            setAddingToShelf(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!reviewData.comment.trim()) {
            toast.error("Please write a comment");
            return;
        }

        try {
            setSubmittingReview(true);
            await createReview(id, reviewData.rating, reviewData.comment);
            toast.success("Review submitted! Waiting for admin approval.");
            setShowReviewForm(false);
            setReviewData({ rating: 5, comment: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <Loader className="w-8 h-8 animate-spin text-secondary" />
            </div>
        );
    }

    if (!book) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-6xl mx-auto">
                {/* BACK BUTTON */}
                <button
                    onClick={() => navigate("/browse")}
                    className="flex items-center gap-2 text-secondary hover:underline mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Browse
                </button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                        {/* BOOK COVER */}
                        <div className="md:col-span-1">
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full rounded-lg shadow-md"
                            />
                        </div>

                        {/* BOOK INFO */}
                        <div className="md:col-span-2">
                            <div className="mb-4">
                                <span className="inline-block bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                                    {book.genre?.name}
                                </span>
                                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                    {book.title}
                                </h1>
                                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                                {/* RATING */}
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${star <= Math.round(book.averageRating)
                                                    ? "text-yellow-500 fill-yellow-500"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-lg font-semibold text-gray-700">
                                        {book.averageRating > 0 ? book.averageRating.toFixed(1) : "No ratings"}
                                    </span>
                                    <span className="text-gray-500">
                                        ({reviews.length} reviews)
                                    </span>
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-3">Description</h2>
                                <p className="text-gray-700 leading-relaxed">{book.description}</p>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleAddToShelf("wantToRead")}
                                    disabled={addingToShelf}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 flex items-center gap-2"
                                >
                                    {addingToShelf ? <Loader className="w-5 h-5 animate-spin" /> : "Want to Read"}
                                </button>
                                <button
                                    onClick={() => handleAddToShelf("currentlyReading")}
                                    disabled={addingToShelf}
                                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-semibold disabled:opacity-50"
                                >
                                    Currently Reading
                                </button>
                                <button
                                    onClick={() => handleAddToShelf("read")}
                                    disabled={addingToShelf}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                                >
                                    Mark as Read
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* REVIEWS SECTION */}
                    <div className="border-t p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>

                        {/* WRITE REVIEW BUTTON */}
                        {!showReviewForm && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="mb-6 bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 font-semibold"
                            >
                                Write a Review
                            </button>
                        )}

                        {/* REVIEW FORM */}
                        {showReviewForm && (
                            <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Write Your Review</h3>

                                {/* RATING SELECTOR */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                className={`w-8 h-8 cursor-pointer transition-colors ${star <= reviewData.rating
                                                    ? "text-yellow-500 fill-yellow-500"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* COMMENT */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Your Review</label>
                                    <textarea
                                        value={reviewData.comment}
                                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                        placeholder="Share your thoughts about this book..."
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    />
                                </div>

                                {/* SUBMIT BUTTONS */}
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="flex items-center gap-2 bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 font-semibold disabled:opacity-50"
                                    >
                                        {submittingReview ? (
                                            <Loader className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                        Submit Review
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowReviewForm(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* REVIEWS LIST */}
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img
                                            src={review.user.photo.startsWith('http')
                                                ? review.user.photo
                                                : `${import.meta.env.VITE_API_URL}/${review.user.photo}`
                                            }
                                            alt={review.user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">{review.user.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* RATING */}
                                    <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= review.rating
                                                    ? "text-yellow-500 fill-yellow-500"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* COMMENT */}
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}

                            {reviews.length === 0 && !showReviewForm && (
                                <div className="text-center text-gray-500 py-8">
                                    <p>No reviews yet. Be the first to review this book!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;