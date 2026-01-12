import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Star, Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getAllBooks } from "../../services/bookService";
import { getAllGenres } from "../../services/genreService";

const BrowseBooks = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

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

    // FILTER BOOKS
    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre === "" || book.genre._id === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-secondary mb-2">Browse Books</h1>
                    <p className="text-gray-600">Discover your next favorite read</p>
                </div>

                {/* SEARCH & FILTER */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* SEARCH */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        {/* GENRE FILTER */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary appearance-none"
                            >
                                <option value="">All Genres</option>
                                {genres.map((genre) => (
                                    <option key={genre._id} value={genre._id}>
                                        {genre.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* RESULTS COUNT */}
                    <p className="text-sm text-gray-600 mt-4">
                        Showing {filteredBooks.length} of {books.length} books
                    </p>
                </div>

                {/* BOOKS GRID */}
                {loading ? (
                    <div className="flex justify-center items-center p-12">
                        <Loader className="w-8 h-8 animate-spin text-secondary" />
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500 text-lg">No books found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredBooks.map((book) => (
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
        </div>
    );
};

export default BrowseBooks;