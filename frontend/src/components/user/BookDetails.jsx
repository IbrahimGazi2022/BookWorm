import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getBookById } from "../../services/bookService";
import { addToShelf } from "../../services/shelfService";

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToShelf, setAddingToShelf] = useState(false);

    useEffect(() => {
        fetchBook();
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
                                        ({book.totalReviews} reviews)
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
                        <div className="text-center text-gray-500 py-8">
                            <p>No reviews yet. Be the first to review this book!</p>
                            <button className="mt-4 bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90">
                                Write a Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;