import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { Plus, Edit2, Trash2, Loader, Upload, X } from "lucide-react";
import { createBook, getAllBooks, updateBook, deleteBook } from "../../services/bookService";
import { getAllGenres } from "../../services/genreService";
import { setAllBooks, setAllGenres } from "../../redux/slices/bookSlice";

// --- FORM COMPONENTS ---
const ImageUpload = ({ preview, onUpload, onRemove }) => (
    <div className="flex flex-col items-center mb-6">
        {preview ? (
            <div className="relative">
                <img src={preview} alt="Preview" className="w-32 h-48 md:w-40 md:h-56 object-cover rounded-lg shadow-lg" />
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        ) : (
            <label className="w-32 h-48 md:w-40 md:h-56 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 text-center px-2">Upload Cover Image</span>
                <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
            </label>
        )}
    </div>
);

// --- TABLE COMPONENTS ---
const BookRow = ({ book, onEdit, onDelete }) => (
    <tr className="border-t hover:bg-gray-50 transition-colors">
        <td className="p-4">
            <img src={book.coverImage} alt={book.title} className="w-12 h-16 object-cover rounded shadow-sm" />
        </td>
        <td className="p-4 font-medium text-gray-800">{book.title}</td>
        <td className="p-4 text-gray-600">{book.author}</td>
        <td className="p-4">
            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                {book.genre?.name}
            </span>
        </td>
        <td className="p-4 text-right">
            <div className="flex justify-end gap-3">
                <button onClick={() => onEdit(book)} className="text-blue-600 hover:text-blue-800 transition-colors">
                    <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => onDelete(book._id)} className="text-red-600 hover:text-red-800 transition-colors">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </td>
    </tr>
);

// --- MOBILE CARD COMPONENT ---
const BookCard = ({ book, onEdit, onDelete }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
        <img src={book.coverImage} alt={book.title} className="w-20 h-28 object-cover rounded-lg shadow-sm" />
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <h3 className="font-bold text-gray-900 leading-tight">{book.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                <p className="text-xs text-secondary mt-1 font-medium italic">{book.genre?.name}</p>
            </div>
            <div className="flex justify-end gap-4 mt-2 pt-2 border-t border-gray-50">
                <button onClick={() => onEdit(book)} className="text-blue-600 flex items-center gap-1 text-sm font-semibold">
                    <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => onDelete(book._id)} className="text-red-600 flex items-center gap-1 text-sm font-semibold">
                    <Trash2 className="w-4 h-4" /> Delete
                </button>
            </div>
        </div>
    </div>
);

// --- MAIN MANAGE BOOKS COMPONENT ---
const ManageBooks = () => {
    const dispatch = useDispatch();
    const { allBooks, allGenres } = useSelector((state) => state.books);

    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({ title: "", author: "", genre: "", description: "" });

    useEffect(() => {
        if (allBooks.length === 0) fetchBooks();
        if (allGenres.length === 0) fetchGenres();
    }, [allBooks.length, allGenres.length]);

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
        } catch (error) {
            toast.error("Failed to fetch genres");
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return toast.error("File size must be less than 5MB");
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.author || !formData.genre || !formData.description) return toast.error("All fields are required");
        if (!editingId && !imageFile) return toast.error("Please upload a cover image");

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append("coverImage", imageFile);

        try {
            setLoading(true);
            editingId ? await updateBook(editingId, data) : await createBook(data);
            toast.success(`Book ${editingId ? "updated" : "created"} successfully`);
            resetForm();
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (book) => {
        setFormData({ title: book.title, author: book.author, genre: book.genre._id, description: book.description });
        setImagePreview(book.coverImage);
        setEditingId(book._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await deleteBook(id);
            toast.success("Book deleted successfully");
            fetchBooks();
        } catch (error) {
            toast.error("Failed to delete book");
        }
    };

    const resetForm = () => {
        setFormData({ title: "", author: "", genre: "", description: "" });
        setImageFile(null);
        setImagePreview(null);
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Manage Books</h1>
                        <p className="text-gray-500 text-sm">Create, edit or remove books from the library</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="w-full md:w-auto bg-secondary text-white px-6 py-2.5 rounded-xl hover:bg-opacity-90 flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        {showForm ? "Close Form" : "Add New Book"}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white p-5 md:p-8 rounded-2xl shadow-lg mb-10 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-secondary">{editingId ? "Edit Book Details" : "New Book Information"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <ImageUpload preview={imagePreview} onUpload={handleImageUpload} onRemove={() => { setImageFile(null); setImagePreview(null); }} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all bg-gray-50" placeholder="Enter book title" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Author *</label>
                                    <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all bg-gray-50" placeholder="Author name" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Genre *</label>
                                <select name="genre" value={formData.genre} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all bg-gray-50">
                                    <option value="">Select a category</option>
                                    {allGenres.map(genre => <option key={genre._id} value={genre._id}>{genre.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all bg-gray-50" placeholder="Write a short summary..." />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button type="submit" disabled={loading} className="flex-1 bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer">
                                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : editingId ? "Save Changes" : "Publish Book"}
                                </button>
                                <button type="button" onClick={resetForm} className="flex-1 bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all cursor-pointer">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-white">
                        <h2 className="text-xl font-bold text-gray-800">Library Collection</h2>
                    </div>

                    {loading && !allBooks.length ? (
                        <div className="flex justify-center items-center p-20"><Loader className="w-10 h-10 animate-spin text-secondary" /></div>
                    ) : allBooks.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Plus className="text-gray-300" /></div>
                            <p className="text-gray-500 font-medium">No books available in the database.</p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 text-gray-500 text-sm uppercase">
                                        <tr>
                                            <th className="p-4 font-bold">Cover</th>
                                            <th className="p-4 font-bold">Details</th>
                                            <th className="p-4 font-bold">Author</th>
                                            <th className="p-4 font-bold">Genre</th>
                                            <th className="p-4 text-right font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {allBooks.map(book => <BookRow key={book._id} book={book} onEdit={handleEdit} onDelete={handleDelete} />)}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                                {allBooks.map(book => <BookCard key={book._id} book={book} onEdit={handleEdit} onDelete={handleDelete} />)}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBooks;