import React, { useState, useEffect } from "react";
import { Youtube, Plus, Edit2, Trash2, Loader, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import {
    getAllTutorials,
    createTutorial,
    updateTutorial,
    deleteTutorial,
} from "../../services/tutorialService";

const ManageTutorials = () => {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTutorial, setEditingTutorial] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        youtubeUrl: "",
        description: "",
        order: 0,
    });

    useEffect(() => {
        fetchTutorials();
    }, []);

    const fetchTutorials = async () => {
        try {
            setLoading(true);
            const data = await getAllTutorials();
            setTutorials(data.tutorials);
        } catch (error) {
            toast.error("Failed to fetch tutorials");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (tutorial = null) => {
        if (tutorial) {
            setEditingTutorial(tutorial);
            setFormData({
                title: tutorial.title,
                youtubeUrl: tutorial.youtubeUrl,
                description: tutorial.description || "",
                order: tutorial.order || 0,
            });
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

        if (!formData.title.trim() || !formData.youtubeUrl.trim()) {
            toast.error("Title and YouTube URL are required");
            return;
        }

        try {
            setSubmitting(true);
            if (editingTutorial) {
                await updateTutorial(editingTutorial._id, formData);
                toast.success("Tutorial updated successfully");
            } else {
                await createTutorial(formData);
                toast.success("Tutorial created successfully");
            }
            handleCloseModal();
            fetchTutorials();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save tutorial");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tutorial?")) {
            return;
        }

        try {
            await deleteTutorial(id);
            toast.success("Tutorial deleted successfully");
            fetchTutorials();
        } catch (error) {
            toast.error("Failed to delete tutorial");
        }
    };

    const extractVideoId = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-secondary" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Youtube className="w-8 h-8 text-secondary" />
                    <h1 className="text-3xl font-bold text-gray-800">Tutorial Management</h1>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 font-semibold"
                >
                    <Plus className="w-5 h-5" />
                    Add Tutorial
                </button>
            </div>

            {/* TUTORIALS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((tutorial) => {
                    const videoId = extractVideoId(tutorial.youtubeUrl);
                    return (
                        <div
                            key={tutorial._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* THUMBNAIL */}
                            {videoId && (
                                <img
                                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                    alt={tutorial.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}

                            {/* CONTENT */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    {tutorial.title}
                                </h3>
                                {tutorial.description && (
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {tutorial.description}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mb-4">Order: {tutorial.order}</p>

                                {/* ACTION BUTTONS */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(tutorial)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tutorial._id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {tutorials.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
                        <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No tutorials found</p>
                    </div>
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* MODAL HEADER */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {editingTutorial ? "Edit Tutorial" : "Add Tutorial"}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* FORM */}
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {/* TITLE */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({ ...formData, title: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                            placeholder="Enter tutorial title"
                                        />
                                    </div>

                                    {/* YOUTUBE URL */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            YouTube URL *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.youtubeUrl}
                                            onChange={(e) =>
                                                setFormData({ ...formData, youtubeUrl: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({ ...formData, description: e.target.value })
                                            }
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                            placeholder="Enter tutorial description"
                                        />
                                    </div>

                                    {/* ORDER */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Order
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) =>
                                                setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {/* SUBMIT BUTTONS */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            editingTutorial ? "Update Tutorial" : "Create Tutorial"
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTutorials;