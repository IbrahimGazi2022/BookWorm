import React, { useState, useEffect } from "react";
import { Youtube, Plus, Edit2, Trash2, Loader, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import {
    getAllTutorials,
    createTutorial,
    updateTutorial,
    deleteTutorial,
} from "../../services/tutorialService";

// --- SUB-COMPONENTS ---

// --- TUTORIAL CARD COMPONENT ---
const TutorialCard = ({ tutorial, onEdit, onDelete, extractVideoId }) => {
    const videoId = extractVideoId(tutorial.youtubeUrl);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">

            {/* THUMBNAIL SECTION */}
            <div className="relative aspect-video bg-gray-100">
                {videoId ? (
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                        alt={tutorial.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Youtube className="w-12 h-12" />
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded font-bold">
                    ORDER: {tutorial.order}
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="p-4 md:p-5">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {tutorial.title}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm mb-4 line-clamp-2 min-h-10">
                    {tutorial.description || "No description provided."}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(tutorial)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(tutorial._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MODAL COMPONENT ---
const TutorialModal = ({ isOpen, onClose, onSubmit, formData, setFormData, isEditing, submitting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    {/* MODAL HEADER */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            {isEditing ? "Edit Tutorial" : "Add New Tutorial"}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    {/* FORM */}
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all bg-gray-50"
                                placeholder="Enter tutorial title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">YouTube URL *</label>
                            <input
                                type="text"
                                value={formData.youtubeUrl}
                                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all bg-gray-50 font-mono text-sm"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all bg-gray-50"
                                placeholder="Briefly describe this video..."
                            />
                        </div>

                        <div className="w-1/2">
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all bg-gray-50"
                            />
                        </div>

                        {/* SUBMIT BUTTONS */}
                        <div className="flex gap-3 mt-8">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                            >
                                {submitting ? <Loader className="w-5 h-5 animate-spin" /> : isEditing ? "Save Changes" : "Create Tutorial"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const ManageTutorials = () => {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTutorial, setEditingTutorial] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ title: "", youtubeUrl: "", description: "", order: 0 });

    useEffect(() => { fetchTutorials(); }, []);

    const fetchTutorials = async () => {
        try {
            setLoading(true);
            const data = await getAllTutorials();
            setTutorials(data.tutorials);
        } catch (error) { toast.error("Failed to fetch tutorials"); }
        finally { setLoading(false); }
    };

    const handleOpenModal = (tutorial = null) => {
        if (tutorial) {
            setEditingTutorial(tutorial);
            setFormData({ title: tutorial.title, youtubeUrl: tutorial.youtubeUrl, description: tutorial.description || "", order: tutorial.order || 0 });
        } else {
            setEditingTutorial(null);
            setFormData({ title: "", youtubeUrl: "", description: "", order: 0 });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTutorial(null);
        setFormData({ title: "", youtubeUrl: "", description: "", order: 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.youtubeUrl.trim()) return toast.error("Title and URL are required");

        try {
            setSubmitting(true);
            editingTutorial ? await updateTutorial(editingTutorial._id, formData) : await createTutorial(formData);
            toast.success(`Tutorial ${editingTutorial ? "updated" : "created"} successfully`);
            handleCloseModal();
            fetchTutorials();
        } catch (error) { toast.error("Failed to save tutorial"); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this tutorial permanently?")) return;
        try {
            await deleteTutorial(id);
            toast.success("Tutorial deleted");
            fetchTutorials();
        } catch (error) { toast.error("Delete failed"); }
    };

    const extractVideoId = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2.5 rounded-xl">
                        <Youtube className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Tutorials</h1>
                        <p className="text-gray-500 text-sm">Manage video content for users</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                    <Plus className="w-5 h-5" />
                    Add Tutorial
                </button>
            </div>

            {/* CONTENT AREA */}
            {loading ? (
                <div className="flex flex-col justify-center items-center h-64 gap-4">
                    <Loader className="w-10 h-10 animate-spin text-secondary" />
                    <p className="text-gray-400 font-medium animate-pulse text-sm">Fetching tutorials...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {tutorials.map((tutorial) => (
                        <TutorialCard
                            key={tutorial._id}
                            tutorial={tutorial}
                            onEdit={handleOpenModal}
                            onDelete={handleDelete}
                            extractVideoId={extractVideoId}
                        />
                    ))}

                    {tutorials.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <Youtube className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No video tutorials available.</p>
                        </div>
                    )}
                </div>
            )}

            {/* MODAL SECTION */}
            <TutorialModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!editingTutorial}
                submitting={submitting}
            />
        </div>
    );
};

export default ManageTutorials;