import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, BookOpen, CheckCircle, Loader, Trash2, Plus, ArrowRight } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getUserShelves, removeFromShelf, updateProgress } from "../../services/shelfService";

const MyLibrary = () => {
    const navigate = useNavigate();
    const [activeShelf, setActiveShelf] = useState("wantToRead");
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProgress, setEditingProgress] = useState({});

    const shelfConfig = [
        { id: "wantToRead", name: "To Read", icon: Book, color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600" },
        { id: "currentlyReading", name: "Reading", icon: BookOpen, color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600" },
        { id: "read", name: "Completed", icon: CheckCircle, color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-600" },
    ];

    useEffect(() => { fetchShelves(); }, []);

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
        if (!window.confirm("Remove this masterpiece from your shelf?")) return;
        try {
            await removeFromShelf(shelfId);
            toast.success("Shelf updated");
            fetchShelves();
        } catch (error) { toast.error("Failed to remove book"); }
    };

    const handleProgressUpdate = async (shelfId, pagesRead, totalPages) => {
        try {
            await updateProgress(shelfId, { pagesRead, totalPages });
            toast.success("Great progress!");
            fetchShelves();
            setEditingProgress({});
        } catch (error) { toast.error("Failed to update progress"); }
    };

    const handleInputChange = (shelfId, field, value) => {
        setEditingProgress(prev => ({
            ...prev,
            [shelfId]: { ...prev[shelfId], [field]: parseInt(value) || 0 }
        }));
    };

    const filteredBooks = shelves.filter(shelf => shelf.shelfType === activeShelf);

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-12">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tight">My <span className="text-secondary">Library</span></h1>
                        <p className="text-gray-400 font-bold text-sm md:text-lg mt-1">Tracking your literary journey</p>
                    </div>
                    <button onClick={() => navigate("/browse")} className="flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-secondary/20 hover:scale-105 transition-all">
                        <Plus className="w-4 h-4" /> Add New Book
                    </button>
                </div>

                {/* SHELF TABS (Scrollable on Mobile) */}
                <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-white p-2 rounded-3xl shadow-sm border border-gray-100">
                    {shelfConfig.map((shelf) => {
                        const count = shelves.filter(s => s.shelfType === shelf.id).length;
                        const isActive = activeShelf === shelf.id;
                        return (
                            <button
                                key={shelf.id}
                                onClick={() => setActiveShelf(shelf.id)}
                                className={`flex-1 min-w-35 flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl font-black text-xs md:text-sm transition-all whitespace-nowrap cursor-pointer ${isActive ? `${shelf.color} text-white shadow-lg` : "text-gray-400 hover:bg-gray-50"
                                    }`}
                            >
                                <shelf.icon className={`w-4 md:w-5 h-4 md:h-5 ${isActive ? "text-white" : "text-gray-300"}`} />
                                {shelf.name}
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* CONTENT AREA */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-24 gap-4">
                        <Loader className="w-10 h-10 animate-spin text-secondary" />
                        <p className="text-gray-400 font-bold animate-pulse">Organizing your shelves...</p>
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${shelfConfig.find(s => s.id === activeShelf).light}`}>
                            {React.createElement(shelfConfig.find(s => s.id === activeShelf).icon, {
                                className: `w-10 h-10 ${shelfConfig.find(s => s.id === activeShelf).text}`
                            })}
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-2">Shelf is Empty</h3>
                        <p className="text-gray-400 font-medium mb-8">You haven't added any books to "{shelfConfig.find(s => s.id === activeShelf).name}" yet.</p>
                        <button onClick={() => navigate("/browse")} className="inline-flex items-center gap-2 text-secondary font-black text-sm uppercase tracking-widest hover:gap-4 transition-all">
                            Browse Books <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map((shelf) => {
                            const currentPagesRead = editingProgress[shelf._id]?.pagesRead ?? shelf.pagesRead;
                            const currentTotalPages = editingProgress[shelf._id]?.totalPages ?? shelf.totalPages;
                            const progressPercent = currentTotalPages > 0 ? Math.min(100, Math.round((currentPagesRead / currentTotalPages) * 100)) : 0;
                            const config = shelfConfig.find(s => s.id === activeShelf);

                            return (
                                <div key={shelf._id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
                                    {/* BOOK COVER */}
                                    <div onClick={() => navigate(`/books/${shelf.book._id}`)} className="relative aspect-4/5 overflow-hidden cursor-pointer">
                                        <img src={shelf.book.coverImage} alt={shelf.book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                        <div className="absolute bottom-4 left-5 right-5 text-white">
                                            <h3 className="font-black text-sm md:text-base line-clamp-1 leading-tight">{shelf.book.title}</h3>
                                            <p className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest mt-1">{shelf.book.author}</p>
                                        </div>
                                    </div>

                                    {/* PROGRESS & ACTIONS */}
                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                                        {shelf.shelfType === "currentlyReading" ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Reading Progress</span>
                                                        <span className="text-sm font-black text-amber-600">{progressPercent}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                        <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Read</label>
                                                        <input type="number" min="0" value={currentPagesRead} onChange={(e) => handleInputChange(shelf._id, 'pagesRead', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500/20 outline-none" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Total</label>
                                                        <input type="number" min="0" value={currentTotalPages} onChange={(e) => handleInputChange(shelf._id, 'totalPages', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500/20 outline-none" />
                                                    </div>
                                                </div>

                                                {editingProgress[shelf._id] && (
                                                    <button onClick={() => handleProgressUpdate(shelf._id, currentPagesRead, currentTotalPages)} className="w-full bg-amber-500 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer">
                                                        Update Status
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className={`py-4 px-4 rounded-2xl flex items-center gap-3 ${config.light}`}>
                                                <config.icon className={`w-5 h-5 ${config.text}`} />
                                                <span className={`text-[11px] font-black uppercase tracking-wider ${config.text}`}>
                                                    {config.name}
                                                </span>
                                            </div>
                                        )}

                                        <button onClick={() => handleRemove(shelf._id)} className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-600 font-bold text-[11px] uppercase tracking-widest pt-2 transition-colors cursor-pointer group/del">
                                            <Trash2 className="w-3.5 h-3.5 group-hover/del:scale-110 transition-transform" /> Remove from shelf
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLibrary;