import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, Loader, Send, BookOpen, CheckCircle2, BookmarkPlus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getBookById } from "../../services/bookService";
import { addToShelf } from "../../services/shelfService";
import { createReview, getApprovedReviewsByBook } from "../../services/reviewService";

// --- SUB-COMPONENTS ---

const ReviewCard = ({ review }) => (
    <div className="bg-gray-50/50 p-4 md:p-6 rounded-2xl border border-gray-100 mb-4 transition-all hover:bg-white hover:shadow-sm">
        <div className="flex items-center gap-3 mb-4">
            <img
                src={review.user.photo.startsWith('http') ? review.user.photo : `${import.meta.env.VITE_API_URL}/${review.user.photo}`}
                alt={review.user.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div>
                <p className="font-bold text-gray-800 text-sm md:text-base">{review.user.name}</p>
                <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-200"}`} />
            ))}
        </div>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed italic">"{review.comment}"</p>
    </div>
);

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
            toast.success("Added to your library!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setAddingToShelf(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewData.comment.trim()) return toast.error("Please write a comment");
        try {
            setSubmittingReview(true);
            await createReview(id, reviewData.rating, reviewData.comment);
            toast.success("Review submitted! Admin will approve it soon.");
            setShowReviewForm(false);
            setReviewData({ rating: 5, comment: "" });
        } catch (error) {
            toast.error("Review submission failed");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center gap-4">
            <Loader className="w-10 h-10 animate-spin text-secondary" />
            <p className="text-gray-400 font-medium animate-pulse">Loading book details...</p>
        </div>
    );

    if (!book) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

            {/* TOP NAVIGATION */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-4 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate("/browse")} className="flex items-center gap-2 text-gray-600 font-bold text-sm hover:text-secondary transition-colors cursor-pointer">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-300">Book Details</div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-6 px-4">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-12">

                        {/* LEFT: BOOK COVER */}
                        <div className="lg:col-span-4 flex justify-center">
                            <div className="relative group w-full max-w-70 md:max-w-full">
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full rounded-3xl shadow-2xl shadow-secondary/20 transform group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                                    <span className="text-[10px] font-black text-secondary uppercase">{book.genre?.name}</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: BOOK INFO */}
                        <div className="lg:col-span-8">
                            <div className="mb-8 text-center lg:text-left">
                                <h1 className="text-3xl md:text-5xl font-black text-gray-800 leading-tight mb-3">
                                    {book.title}
                                </h1>
                                <p className="text-lg md:text-2xl text-gray-400 font-medium mb-6">by <span className="text-secondary">{book.author}</span></p>

                                {/* RATING DISPLAY */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                        <span className="text-lg font-black text-amber-700">
                                            {book.averageRating > 0 ? book.averageRating.toFixed(1) : "N/A"}
                                        </span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-400">
                                        Based on <span className="text-gray-800">{reviews.length} reviews</span>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 w-full mb-8" />

                                <h2 className="text-lg font-black text-gray-800 mb-3 uppercase tracking-wider">Description</h2>
                                <p className="text-gray-600 text-sm md:text-lg leading-relaxed mb-10">
                                    {book.description}
                                </p>

                                {/* ACTION BUTTONS */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <button
                                        onClick={() => handleAddToShelf("wantToRead")}
                                        disabled={addingToShelf}
                                        className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-6 py-4 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                    >
                                        <BookmarkPlus className="w-5 h-5" /> Want to Read
                                    </button>
                                    <button
                                        onClick={() => handleAddToShelf("currentlyReading")}
                                        disabled={addingToShelf}
                                        className="flex items-center justify-center gap-2 bg-amber-50 text-amber-600 px-6 py-4 rounded-2xl font-bold hover:bg-amber-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                    >
                                        <BookOpen className="w-5 h-5" /> Reading
                                    </button>
                                    <button
                                        onClick={() => handleAddToShelf("read")}
                                        disabled={addingToShelf}
                                        className="flex items-center justify-center gap-2 bg-green-50 text-green-600 px-6 py-4 rounded-2xl font-bold hover:bg-green-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                    >
                                        <CheckCircle2 className="w-5 h-5" /> Completed
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* REVIEWS SECTION */}
                    <div className="bg-gray-50/30 p-6 md:p-12 border-t border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-gray-800">Reader Reviews</h2>
                                <p className="text-gray-400 text-sm font-medium">Hear what others have to say</p>
                            </div>
                            {!showReviewForm && (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="bg-secondary text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-xl hover:shadow-secondary/20 transition-all active:scale-95 cursor-pointer text-sm"
                                >
                                    Write a Review
                                </button>
                            )}
                        </div>

                        {/* REVIEW FORM */}
                        {showReviewForm && (
                            <div className="bg-white p-6 md:p-8 rounded-4xl border border-secondary/10 shadow-xl mb-10 animate-in slide-in-from-top-4 duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-gray-800">Your Experience</h3>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                className={`w-8 h-8 cursor-pointer transition-all hover:scale-110 ${star <= reviewData.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-200"}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <textarea
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                    placeholder="What did you love (or hate) about this book?"
                                    rows="4"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm md:text-base mb-6"
                                />

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSubmitReview}
                                        disabled={submittingReview}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-secondary text-white px-10 py-4 rounded-2xl font-bold hover:shadow-lg disabled:opacity-50 cursor-pointer"
                                    >
                                        {submittingReview ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        Submit Feedback
                                    </button>
                                    <button
                                        onClick={() => setShowReviewForm(false)}
                                        className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* REVIEWS LIST */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reviews.map((review) => (
                                <ReviewCard key={review._id} review={review} />
                            ))}
                        </div>

                        {reviews.length === 0 && !showReviewForm && (
                            <div className="text-center py-16">
                                <Star className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold">No reviews yet. Start the conversation!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;