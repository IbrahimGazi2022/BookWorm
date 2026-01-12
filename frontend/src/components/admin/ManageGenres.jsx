import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Plus, Edit2, Trash2, Loader } from "lucide-react";
import { createGenre, getAllGenres, updateGenre, deleteGenre } from "../../services/genreService";

const ManageGenres = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            setLoading(true);
            const data = await getAllGenres();
            setGenres(data.genres);
        } catch (error) {
            toast.error("Failed to fetch genres");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error("Genre name is required");
            return;
        }

        try {
            setLoading(true);
            if (editingId) {
                await updateGenre(editingId, formData);
                toast.success("Genre updated successfully");
            } else {
                await createGenre(formData);
                toast.success("Genre created successfully");
            }
            setFormData({ name: "" });
            setEditingId(null);
            fetchGenres();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (genre) => {
        setFormData({ name: genre.name });
        setEditingId(genre._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this genre?")) return;

        try {
            await deleteGenre(id);
            toast.success("Genre deleted successfully");
            fetchGenres();
        } catch (error) {
            toast.error("Failed to delete genre");
        }
    };

    const handleCancel = () => {
        setFormData({ name: "" });
        setEditingId(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Genres</h1>

                {/* ADD/EDIT FORM */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? "Edit Genre" : "Add New Genre"}
                    </h2>
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ name: e.target.value })}
                            placeholder="Genre name (e.g., Mystery, Romance)"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : editingId ? (
                                <>
                                    <Edit2 className="w-5 h-5" />
                                    Update
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Add
                                </>
                            )}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                {/* GENRES LIST */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <h2 className="text-xl font-semibold p-6 border-b">All Genres</h2>
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <Loader className="w-8 h-8 animate-spin text-secondary" />
                        </div>
                    ) : genres.length === 0 ? (
                        <p className="text-center text-gray-500 p-12">No genres found</p>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-700">Genre Name</th>
                                    <th className="text-right p-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {genres.map((genre) => (
                                    <tr key={genre._id} className="border-t hover:bg-gray-50">
                                        <td className="p-4">{genre.name}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleEdit(genre)}
                                                className="text-blue-600 hover:text-blue-800 mr-4"
                                            >
                                                <Edit2 className="w-5 h-5 inline" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(genre._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="w-5 h-5 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageGenres;