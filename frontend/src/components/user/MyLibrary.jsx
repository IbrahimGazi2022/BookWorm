import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, BookOpen, CheckCircle, Loader, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getUserShelves, removeFromShelf, updateProgress } from "../../services/shelfService";

const MyLibrary = () => {
    const navigate = useNavigate();
    const [activeShelf, setActiveShelf] = useState("wantToRead");
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProgress, setEditingProgress] = useState({});

    const shelfConfig = [
        { id: "wantToRead", name: "Want to Read", icon: Book, color: "bg-blue-500" },
        { id: "currentlyReading", name: "Currently Reading", icon: BookOpen, color: "bg-yellow-500" },
        { id: "read", name: "Read", icon: CheckCircle, color: "bg-green-500" },
    ];

    useEffect(() => {
        fetchShelves();
    }, []);

    const fetchShelves = async () => {
        try {
            setLoading(true);
            const data = await getUserShelves();
            setShelves(data.shelves);
        } catch (error) {
            toast.error("Failed to fetch shelves");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (shelfId) => {
        if (!window.confirm("Remove this book from shelf?")) return;

        try {
            await removeFromShelf(shelfId);
            toast.success("Book removed from shelf");
            fetchShelves();
        } catch (error) {
            toast.error("Failed to remove book");
        }
    };

    const handleProgressUpdate = async (shelfId, pagesRead, totalPages) => {
        try {
            await updateProgress(shelfId, { pagesRead, totalPages });
            toast.success("Progress updated");
            fetchShelves();
            setEditingProgress({});
        } catch (error) {
            toast.error("Failed to update progress");
        }
    };

    const handleInputChange = (shelfId, field, value) => {
        setEditingProgress(prev => ({
            ...prev,
            [shelfId]: {
                ...prev[shelfId],
                [field]: parseInt(value) || 0
            }
        }));
    };

    // FILTER BOOKS BY ACTIVE SHELF
    const filteredBooks = shelves.filter(shelf => shelf.shelfType === activeShelf);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-secondary mb-2">My Library</h1>
                    <p className="text-gray-600">Organize and track your reading journey</p>
                </div>

                {/* SHELF TABS */}
                <div className="bg-white rounded-lg shadow-md mb-8">
                    <div className="flex border-b">
                        {shelfConfig.map((shelf) => (
                            <button
                                key={shelf.id}
                                onClick={() => setActiveShelf(shelf.id)}
                                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-colors ${activeShelf === shelf.id
                                        ? "border-b-4 border-secondary text-secondary"
                                        : "text-gray-600 hover:text-secondary"
                                    }`}
                            >
                                <shelf.icon className="w-5 h-5" />
                                {shelf.name}
                                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                                    {shelves.filter(s => s.shelfType === shelf.id).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* SHELF CONTENT */}
                    <div className="p-8">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader className="w-8 h-8 animate-spin text-secondary" />
                            </div>
                        ) : filteredBooks.length === 0 ? (
                            <div className="text-center py-12">
                                <div className={`${shelfConfig.find(s => s.id === activeShelf).color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    {React.createElement(shelfConfig.find(s => s.id === activeShelf).icon, {
                                        className: "w-8 h-8 text-white"
                                    })}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    No books in this shelf
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Start adding books from the Browse page!
                                </p>
                                <button
                                    onClick={() => navigate("/browse")}
                                    className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                                >
                                    Browse Books
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredBooks.map((shelf) => {
                                    const currentPagesRead = editingProgress[shelf._id]?.pagesRead ?? shelf.pagesRead;
                                    const currentTotalPages = editingProgress[shelf._id]?.totalPages ?? shelf.totalPages;
                                    const progressPercent = currentTotalPages > 0
                                        ? Math.min(100, Math.round((currentPagesRead / currentTotalPages) * 100))
                                        : 0;

                                    return (
                                        <div
                                            key={shelf._id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                                        >
                                            {/* BOOK COVER */}
                                            <div
                                                onClick={() => navigate(`/books/${shelf.book._id}`)}
                                                className="relative h-64 overflow-hidden cursor-pointer"
                                            >
                                                <img
                                                    src={shelf.book.coverImage}
                                                    alt={shelf.book.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* BOOK INFO */}
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                                                    {shelf.book.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-3">by {shelf.book.author}</p>

                                                {/* PROGRESS TRACKING (for Currently Reading) */}
                                                {shelf.shelfType === "currentlyReading" && (
                                                    <div className="mb-3 space-y-3">
                                                        {/* PROGRESS BAR */}
                                                        <div>
                                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                                <span>Progress</span>
                                                                <span>{progressPercent}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-yellow-500 h-2 rounded-full transition-all"
                                                                    style={{ width: `${progressPercent}%` }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* PAGES INPUT */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="text-xs text-gray-600 block mb-1">Pages Read</label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={currentPagesRead}
                                                                    onChange={(e) => handleInputChange(shelf._id, 'pagesRead', e.target.value)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-600 block mb-1">Total Pages</label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={currentTotalPages}
                                                                    onChange={(e) => handleInputChange(shelf._id, 'totalPages', e.target.value)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* UPDATE BUTTON */}
                                                        {(editingProgress[shelf._id]) && (
                                                            <button
                                                                onClick={() => handleProgressUpdate(shelf._id, currentPagesRead, currentTotalPages)}
                                                                className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 text-sm font-semibold"
                                                            >
                                                                Update Progress
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {/* REMOVE BUTTON */}
                                                <button
                                                    onClick={() => handleRemove(shelf._id)}
                                                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyLibrary;