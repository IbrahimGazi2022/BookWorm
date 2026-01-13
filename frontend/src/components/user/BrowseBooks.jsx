import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Star, Loader, X, SlidersHorizontal } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getAllBooks } from "../../services/bookService";
import { getAllGenres } from "../../services/genreService";

const BrowseBooks = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("title");

    useEffect(() => {
        fetchBooks();
        fetchGenres();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await getAllBooks();
            setBooks(data.books);
        } catch (error) {
            toast.error("Failed to fetch books");
        } finally {
            setLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const data = await getAllGenres();
            setGenres(data.genres);
        } catch (error) {
            console.error("Failed to fetch genres");
        }
    };

    const handleGenreToggle = (genreId) => {
        setSelectedGenres(prev =>
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId]
        );
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedGenres([]);
        setMinRating(0);
        setSortBy("title");
    };

    // FILTER & SORT BOOKS
    const filteredAndSortedBooks = books
        .filter((book) => {
            const matchesSearch =
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesGenre = selectedGenres.length === 0 ||
                selectedGenres.includes(book.genre._id);

            const matchesRating = book.averageRating >= minRating;

            return matchesSearch && matchesGenre && matchesRating;
        })
        .sort((a, b) => {
            if (sortBy === "rating-high") {
                return b.averageRating - a.averageRating;
            } else if (sortBy === "rating-low") {
                return a.averageRating - b.averageRating;
            } else if (sortBy === "title") {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

    return (
        <div>
            <ToastContainer position="top-right" autoClose={3000} />

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-secondary mb-2">Browse Books</h1>
                <p className="text-gray-600">Discover your next favorite read</p>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                {/* SEARCH BAR */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* SORT */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <SlidersHorizontal className="w-4 h-4 inline mr-2" />
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                            <option value="title">Title (A-Z)</option>
                            <option value="rating-high">Rating (High to Low)</option>
                            <option value="rating-low">Rating (Low to High)</option>
                        </select>
                    </div>

                    {/* RATING FILTER */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Star className="w-4 h-4 inline mr-2 text-yellow-500" />
                            Minimum Rating
                        </label>
                        <select
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                            <option value={0}>All Ratings</option>
                            <option value={1}>1+ Stars</option>
                            <option value={2}>2+ Stars</option>
                            <option value={3}>3+ Stars</option>
                            <option value={4}>4+ Stars</option>
                            <option value={5}>5 Stars</option>
                        </select>
                    </div>

                    {/* CLEAR FILTERS */}
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* MULTI-SELECT GENRES */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Filter className="w-4 h-4 inline mr-2" />
                        Filter by Genres (Multi-select)
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                            <button
                                key={genre._id}
                                onClick={() => handleGenreToggle(genre._id)}
                                className={`px-4 py-2 rounded-full font-semibold transition-colors ${selectedGenres.includes(genre._id)
                                        ? "bg-secondary text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {genre.name}
                                {selectedGenres.includes(genre._id) && (
                                    <X className="w-4 h-4 inline ml-1" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RESULTS COUNT */}
                <p className="text-sm text-gray-600 mt-4">
                    Showing {filteredAndSortedBooks.length} of {books.length} books
                </p>
            </div>

            {/* BOOKS GRID */}
            {loading ? (
                <div className="flex justify-center items-center p-12">
                    <Loader className="w-8 h-8 animate-spin text-secondary" />
                </div>
            ) : filteredAndSortedBooks.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500 text-lg">No books found</p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedBooks.map((book) => (
                        <div
                            key={book._id}
                            onClick={() => navigate(`/books/${book._id}`)}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                        >
                            {/* BOOK COVER */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-secondary text-white px-2 py-1 rounded-full text-xs font-semibold">
                                    {book.genre?.name}
                                </div>
                            </div>

                            {/* BOOK INFO */}
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                                    {book.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

                                {/* RATING */}
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-semibold text-gray-700">
                                        {book.averageRating > 0 ? book.averageRating.toFixed(1) : "No ratings"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({book.totalReviews} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseBooks;