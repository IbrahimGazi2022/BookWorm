import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Star, Loader, Info, Book, FileText, TrendingUp, Award, Calendar } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast, ToastContainer } from "react-toastify";
import { getRecommendations } from "../../services/bookService";
import { getUserStats } from "../../services/shelfService";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hoveredBook, setHoveredBook] = useState(null);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [recsData, statsData] = await Promise.all([
                getRecommendations(),
                getUserStats()
            ]);
            setRecommendations(recsData.recommendations);
            setStats(statsData);
        } catch (error) {
            toast.error("Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <Loader className="w-8 h-8 animate-spin text-secondary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-secondary mb-2">
                        Welcome back! 📚
                    </h1>
                    <p className="text-gray-600">
                        Discover your next great read with personalized recommendations
                    </p>
                </div>

                {/* READING STATS CARDS */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">Books This Year</h3>
                            <p className="text-3xl font-bold text-secondary">{stats.booksThisYear}</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <Book className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Books Read</h3>
                            <p className="text-3xl font-bold text-secondary">{stats.totalBooksRead}</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Pages</h3>
                            <p className="text-3xl font-bold text-secondary">{stats.totalPages.toLocaleString()}</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-yellow-100 p-3 rounded-lg">
                                    <Star className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">Avg Rating</h3>
                            <p className="text-3xl font-bold text-secondary">{stats.avgRating || 'N/A'}</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-orange-100 p-3 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">Reading Streak</h3>
                            <p className="text-3xl font-bold text-secondary">{stats.readingStreak} days</p>
                        </div>
                    </div>
                )}

                {/* CHARTS SECTION */}
                {stats && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* FAVORITE GENRES - PIE CHART */}
                        {stats.favoriteGenres.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Favorite Genres</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={stats.favoriteGenres.slice(0, 6)}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {stats.favoriteGenres.slice(0, 6).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* MONTHLY BOOKS - BAR CHART */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Reading</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={stats.monthlyBooks}>
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="books" fill="#8b5cf6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* PAGES OVER TIME - LINE CHART */}
                        {stats.pagesOverTime.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Pages Progress</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={stats.pagesOverTime}>
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="pages" stroke="#10b981" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}

                {/* RECOMMENDATIONS SECTION */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="w-8 h-8 text-secondary" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            Recommended For You
                        </h2>
                    </div>

                    {recommendations.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                No recommendations yet
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Start reading books to get personalized recommendations!
                            </p>
                            <button
                                onClick={() => navigate("/browse")}
                                className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                            >
                                Browse Books
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {recommendations.map((book) => (
                                <div
                                    key={book._id}
                                    className="relative group"
                                    onMouseEnter={() => setHoveredBook(book._id)}
                                    onMouseLeave={() => setHoveredBook(null)}
                                >
                                    <div
                                        onClick={() => navigate(`/books/${book._id}`)}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <span className="bg-secondary text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                    {book.genre.name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-3">
                                            <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">
                                                {book.title}
                                            </h3>
                                            <p className="text-xs text-gray-600 mb-2">
                                                by {book.author}
                                            </p>

                                            {book.avgRating > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-xs text-gray-700 font-semibold">
                                                        {book.avgRating.toFixed(1)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {hoveredBook === book._id && book.reason && (
                                        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64">
                                            <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
                                                <div className="flex items-start gap-2">
                                                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold mb-1">Why this book?</p>
                                                        <p className="text-gray-300">{book.reason}</p>
                                                    </div>
                                                </div>
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                                    <div className="border-8 border-transparent border-t-gray-900"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* QUICK LINKS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        onClick={() => navigate("/browse")}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Browse All Books</h3>
                        <p className="text-gray-600 text-sm">
                            Explore our complete collection
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/my-library")}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-2">My Library</h3>
                        <p className="text-gray-600 text-sm">
                            View your reading shelves
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Annual Goal</h3>
                        <p className="text-gray-600 text-sm">Coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;