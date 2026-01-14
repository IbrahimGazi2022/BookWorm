import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter, Star, Loader, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getAllBooks } from "../../services/bookService";
import { getAllGenres } from "../../services/genreService";
import { setAllBooks, setAllGenres } from "../../redux/slices/bookSlice";

const BrowseBooks = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const books = useSelector((state) => state.books.allBooks);
    const genres = useSelector((state) => state.books.allGenres);

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("title");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (books.length === 0) {
            fetchBooks();
        }
        if (genres.length === 0) {
            fetchGenres();
        }
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await getAllBooks();
            dispatch(setAllBooks(data.books));
        } catch (error) {
            toast.error("Failed to fetch books");
        } finally {
            setLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const data = await getAllGenres();
            dispatch(setAllGenres(data.genres));
        } catch (error) { console.error("Genre fetch error"); }
    };

    const handleGenreToggle = (genreId) => {
        setSelectedGenres(prev =>
            prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]
        );
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedGenres([]);
        setMinRating(0);
        setSortBy("title");
    };

    const filteredAndSortedBooks = books
        .filter((book) => {
            const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(book.genre?._id);
            const matchesRating = book.averageRating >= minRating;
            return matchesSearch && matchesGenre && matchesRating;
        })
        .sort((a, b) => {
            if (sortBy === "rating-high") return b.averageRating - a.averageRating;
            if (sortBy === "rating-low") return a.averageRating - b.averageRating;
            return a.title.localeCompare(b.title);
        });

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-12">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

            <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-wide mb-2">
                    Browse <span className="text-secondary">Library</span>
                </h1>
                <p className="text-gray-500 text-sm md:text-lg font-medium">Discover your next favorite masterpiece</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by title, author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-sm md:text-base"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center justify-center gap-2 bg-white border border-gray-100 p-4 rounded-2xl font-bold text-gray-700 shadow-sm active:scale-95 transition-all"
                >
                    <SlidersHorizontal className="w-5 h-5 text-secondary" />
                    {showFilters ? "Hide Filters" : "Filters & Sorting"}
                </button>
            </div>

            <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-50 mb-10 animate-in fade-in slide-in-from-top-4 duration-300`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                    <div className="space-y-3">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1 mb-3">Sort Results</label>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full appearance-none px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none font-bold text-gray-700 text-sm cursor-pointer"
                            >
                                <option value="title">Alphabetical (A-Z)</option>
                                <option value="rating-high">Top Rated First</option>
                                <option value="rating-low">Lowest Rated First</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1 mb-3">Minimum Rating</label>
                        <div className="flex gap-2">
                            {[0, 3, 4, 5].map((stars) => (
                                <button
                                    key={stars}
                                    onClick={() => setMinRating(stars)}
                                    className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${minRating === stars ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {stars === 0 ? "All" : `${stars}+ ★`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 lg:col-span-1 space-y-3">
                        <label className=" block text-xs font-black uppercase tracking-widest text-gray-400 ml-1 mb-3">Genres</label>
                        <div className="flex flex-wrap gap-2">
                            {genres.slice(0, 6).map((genre) => (
                                <button
                                    key={genre._id}
                                    onClick={() => handleGenreToggle(genre._id)}
                                    className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${selectedGenres.includes(genre._id) ? 'bg-secondary/10 text-secondary ring-1 ring-secondary' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
                    <p className="text-xs md:text-sm font-bold text-gray-400">
                        Found <span className="text-gray-800">{filteredAndSortedBooks.length}</span> masterpieces
                    </p>
                    <button onClick={clearFilters} className="text-xs font-black text-red-500 hover:text-red-600 uppercase tracking-widest cursor-pointer">
                        Reset Filters
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center py-24 gap-4">
                    <Loader className="w-10 h-10 animate-spin text-secondary" />
                    <p className="text-gray-400 font-bold animate-pulse">Curating your library...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                    {filteredAndSortedBooks.map((book) => (
                        <div
                            key={book._id}
                            onClick={() => navigate(`/books/${book._id}`)}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-2/3 overflow-hidden rounded-3xl md:rounded-4xl shadow-sm group-hover:shadow-2xl group-hover:shadow-secondary/20 transition-all duration-500">
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 backdrop-blur-sm text-secondary text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                                        {book.genre?.name}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 px-1">
                                <h3 className="font-black text-gray-800 text-sm md:text-base line-clamp-1 group-hover:text-secondary transition-colors">
                                    {book.title}
                                </h3>
                                <p className="text-[11px] md:text-sm text-gray-400 font-bold mb-2 uppercase tracking-wide">{book.author}</p>

                                <div className="flex items-center gap-1.5">
                                    <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-lg">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-[11px] md:text-xs font-black text-amber-700">
                                            {book.averageRating > 0 ? book.averageRating.toFixed(1) : "N/A"}
                                        </span>
                                    </div>
                                    <span className="text-[10px] md:text-xs text-gray-300 font-bold">
                                        ({book.totalReviews})
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredAndSortedBooks.length === 0 && (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <Search className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 font-black text-lg">No books match your criteria</p>
                    <button onClick={clearFilters} className="mt-4 text-secondary font-bold hover:underline cursor-pointer text-sm">
                        Try clearing filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrowseBooks;