import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Star, Loader, Info, Book, FileText, TrendingUp, Calendar, Target, Edit2, X, ChevronRight, Award } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast, ToastContainer } from "react-toastify";
import { getRecommendations } from "../../services/bookService";
import { getUserStats } from "../../services/shelfService";
import { getReadingGoal, setReadingGoal } from "../../services/authService";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [stats, setStats] = useState(null);
    const [goal, setGoal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hoveredBook, setHoveredBook] = useState(null);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [goalInput, setGoalInput] = useState({ year: new Date().getFullYear(), target: 0 });

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [recsData, statsData, goalData] = await Promise.all([
                getRecommendations(),
                getUserStats(),
                getReadingGoal()
            ]);
            setRecommendations(recsData.recommendations);
            setStats(statsData);
            setGoal(goalData.readingGoal);
        } catch (error) {
            toast.error("Data fetch failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenGoalModal = () => {
        setGoalInput(goal?.target > 0 ? { year: goal.year, target: goal.target } : { year: new Date().getFullYear(), target: 12 });
        setShowGoalModal(true);
    };

    const handleSaveGoal = async () => {
        if (goalInput.target <= 0) return toast.error("Enter a valid target");
        try {
            await setReadingGoal(goalInput);
            toast.success("Goal locked in!");
            setShowGoalModal(false);
            fetchData();
        } catch (error) { toast.error("Update failed"); }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center gap-4">
            <Loader className="w-10 h-10 animate-spin text-secondary" />
            <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Assembling your stats...</p>
        </div>
    );

    const progressPercent = goal?.target > 0 && stats ? Math.min(100, Math.round((stats.booksThisYear / goal.target) * 100)) : 0;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-12">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

            <div className="max-w-7xl mx-auto">
                {/* HERO HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tight">
                            Happy Reading, <span className="text-secondary">Ibrahim</span>! 📚
                        </h1>
                        <p className="text-gray-400 font-bold text-sm md:text-lg mt-1">Here's your reading journey at a glance.</p>
                    </div>
                    {stats?.readingStreak > 0 && (
                        <div className="bg-amber-50 border border-amber-100 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
                            <TrendingUp className="text-amber-600 w-6 h-6" />
                            <div>
                                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Active Streak</p>
                                <p className="text-xl font-black text-amber-600">{stats.readingStreak} Days</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* STATS GRID */}
                {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                        {[
                            { label: "This Year", val: stats.booksThisYear, icon: Calendar, col: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Total Books", val: stats.totalBooksRead, icon: Book, col: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "Pages Read", val: stats.totalPages.toLocaleString(), icon: FileText, col: "text-purple-600", bg: "bg-purple-50" },
                            { label: "Avg Rating", val: stats.avgRating || "0.0", icon: Star, col: "text-amber-600", bg: "bg-amber-50" }
                        ].map((s, i) => (
                            <div key={i} className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                                    <s.icon className={`${s.col} w-5 h-5`} />
                                </div>
                                <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                                <p className="text-2xl md:text-3xl font-black text-gray-800 mt-1">{s.val}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* CHARTS & GOAL SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    {/* MONTHLY PROGRESS BAR CHART */}
                    <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-gray-800">Reading Activity</h2>
                            <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full uppercase text-gray-400">Monthly breakdown</span>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats?.monthlyBooks}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="books" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* ANNUAL GOAL CIRCULAR PROGRESS */}
                    <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="flex items-center justify-between w-full mb-6">
                            <h2 className="text-lg font-black text-gray-800">Annual Goal</h2>
                            <button onClick={handleOpenGoalModal} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"><Edit2 className="w-4 h-4" /></button>
                        </div>

                        {goal?.target > 0 ? (
                            <>
                                <div className="relative w-48 h-48 mb-6">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="96" cy="96" r="80" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                                        <circle cx="96" cy="96" r="80" stroke="#8b5cf6" strokeWidth="12" fill="none" strokeDasharray={502} strokeDashoffset={502 - (502 * progressPercent) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-gray-800">{progressPercent}%</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed</span>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-gray-600">
                                    <span className="text-secondary">{stats?.booksThisYear}</span> of <span className="text-gray-800">{goal.target}</span> books read
                                </p>
                            </>
                        ) : (
                            <div className="py-6 flex flex-col items-center">
                                <Award className="w-16 h-16 text-gray-100 mb-4" />
                                <button onClick={handleOpenGoalModal} className="bg-secondary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-secondary/20 active:scale-95 transition-all">Set 2026 Goal</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RECOMMENDATIONS SECTION */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-secondary" />
                            <h2 className="text-2xl font-black text-gray-800">Picked for You</h2>
                        </div>
                        <button onClick={() => navigate("/browse")} className="text-xs font-black text-secondary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">Explore More <ChevronRight className="w-4 h-4" /></button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {recommendations.slice(0, 6).map((book) => (
                            <div key={book._id} className="relative group cursor-pointer" onMouseEnter={() => setHoveredBook(book._id)} onMouseLeave={() => setHoveredBook(null)} onClick={() => navigate(`/books/${book._id}`)}>
                                <div className="aspect-2/3 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl group-hover:shadow-secondary/20 transition-all duration-500 mb-3">
                                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <h3 className="text-xs font-black text-gray-800 line-clamp-1 group-hover:text-secondary transition-colors">{book.title}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">{book.author}</p>

                                {hoveredBook === book._id && book.reason && (
                                    <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 animate-in fade-in zoom-in duration-200">
                                        <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl relative">
                                            <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-1">Why this?</p>
                                            <p className="text-[11px] leading-relaxed text-gray-300 font-medium">{book.reason}</p>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODAL - Simplified for Ibrahim's aesthetic */}
            {showGoalModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Set 2026 Goal</h2>
                            <button onClick={() => setShowGoalModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Books</label>
                                <input type="number" value={goalInput.target} onChange={(e) => setGoalInput({ ...goalInput, target: parseInt(e.target.value) || 0 })} className="w-full mt-2 px-6 py-4 bg-gray-50 border-none rounded-2xl text-lg font-black focus:ring-2 focus:ring-secondary/20 outline-none" placeholder="e.g. 24" />
                            </div>
                            <button onClick={handleSaveGoal} className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-secondary/20 active:scale-95 transition-all">Lock Goal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;