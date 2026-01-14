import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { Plus, Edit2, Trash2, Loader, X } from "lucide-react";
import { createGenre, getAllGenres, updateGenre, deleteGenre } from "../../services/genreService";
import { setAllGenres } from "../../redux/slices/bookSlice";

// --- FORM COMPONENT ---
const GenreForm = ({ formData, setFormData, handleSubmit, loading, editingId, onCancel }) => (
    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
            {editingId ? "Update Genre Name" : "Add New Genre Category"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Genre name (e.g., Mystery, Romance)"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all bg-gray-50 font-medium"
            />
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : (
                        <>
                            {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                            {editingId ? "Update" : "Add"}
                        </>
                    )}
                </button>
                {editingId && (
                    <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </form>
    </div>
);

// --- LIST ITEM COMPONENT ---
const GenreListItem = ({ genre, onEdit, onDelete }) => (
    <tr className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors group">
        <td className="p-4">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary/40 group-hover:bg-secondary transition-colors" />
                <span className="font-semibold text-gray-700">{genre.name}</span>
            </div>
        </td>
        <td className="p-4 text-right">
            <div className="flex justify-end gap-2 md:gap-4">
                <button onClick={() => onEdit(genre)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => onDelete(genre._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </td>
    </tr>
);

// --- MAIN MANAGE GENRES COMPONENT ---
const ManageGenres = () => {
    const dispatch = useDispatch();
    const { allGenres } = useSelector((state) => state.books);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (allGenres.length === 0) {
            fetchGenres();
        }
    }, [allGenres.length]);

    const fetchGenres = async () => {
        try {
            setLoading(true);
            const data = await getAllGenres();
            dispatch(setAllGenres(data.genres));
        } catch (error) {
            toast.error("Failed to fetch genres");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return toast.error("Genre name is required");

        try {
            setLoading(true);
            if (editingId) {
                await updateGenre(editingId, formData);
                toast.success("Genre updated successfully");
            } else {
                await createGenre(formData);
                toast.success("Genre created successfully");
            }
            handleCancel();
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
        window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Manage Genres</h1>
                    <p className="text-gray-500 text-sm md:text-base">Organize and categorize your book collection</p>
                </div>

                <GenreForm
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    editingId={editingId}
                    onCancel={handleCancel}
                />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-800">Available Categories</h2>
                        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">
                            {allGenres.length} Total
                        </span>
                    </div>

                    {loading && !allGenres.length ? (
                        <div className="flex justify-center items-center p-16">
                            <Loader className="w-8 h-8 animate-spin text-secondary" />
                        </div>
                    ) : allGenres.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Plus className="text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium italic">No genres found. Start by adding one!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-widest font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Genre Name</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {allGenres.map((genre) => (
                                        <GenreListItem
                                            key={genre._id}
                                            genre={genre}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageGenres;