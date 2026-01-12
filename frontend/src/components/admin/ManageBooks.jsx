import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Plus, Edit2, Trash2, Loader, Upload, X } from "lucide-react";
import { createBook, getAllBooks, updateBook, deleteBook } from "../../services/bookService";
import { getAllGenres } from "../../services/genreService";

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        description: ""
    });

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
            toast.error("Failed to fetch genres");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.author || !formData.genre || !formData.description) {
            toast.error("All fields are required");
            return;
        }

        if (!editingId && !imageFile) {
            toast.error("Please upload a cover image");
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("author", formData.author);
        data.append("genre", formData.genre);
        data.append("description", formData.description);
        if (imageFile) {
            data.append("coverImage", imageFile);
        }

        try {
            setLoading(true);
            if (editingId) {
                await updateBook(editingId, data);
                toast.success("Book updated successfully");
            } else {
                await createBook(data);
                toast.success("Book created successfully");
            }
            resetForm();
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (book) => {
        setFormData({
            title: book.title,
            author: book.author,
            genre: book.genre._id,
            description: book.description
        });
        setImagePreview(book.coverImage);
        setEditingId(book._id);
        setShowForm(true);
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
        setFormData({
            title: "",
            author: "",
            genre: "",
            description: ""
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Books</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Book
                    </button>
                </div>

                {/* ADD/EDIT FORM */}
                {showForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingId ? "Edit Book" : "Add New Book"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* IMAGE UPLOAD */}
                            <div className="flex flex-col items-center mb-6">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-40 h-56 object-cover rounded-lg shadow-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="w-40 h-56 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-secondary">
                                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Upload Cover</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* TITLE & AUTHOR */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Author *
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    />
                                </div>
                            </div>

                            {/* GENRE */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Genre *
                                </label>
                                <select
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                >
                                    <option value="">Select Genre</option>
                                    {genres.map((genre) => (
                                        <option key={genre._id} value={genre._id}>
                                            {genre.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <Loader className="w-5 h-5 animate-spin" />
                                    ) : editingId ? (
                                        "Update Book"
                                    ) : (
                                        "Add Book"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* BOOKS LIST */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <h2 className="text-xl font-semibold p-6 border-b">All Books</h2>
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <Loader className="w-8 h-8 animate-spin text-secondary" />
                        </div>
                    ) : books.length === 0 ? (
                        <p className="text-center text-gray-500 p-12">No books found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-gray-700">Cover</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Title</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Author</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Genre</th>
                                        <th className="text-right p-4 font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map((book) => (
                                        <tr key={book._id} className="border-t hover:bg-gray-50">
                                            <td className="p-4">
                                                <img
                                                    src={book.coverImage}
                                                    alt={book.title}
                                                    className="w-12 h-16 object-cover rounded"
                                                />
                                            </td>
                                            <td className="p-4">{book.title}</td>
                                            <td className="p-4">{book.author}</td>
                                            <td className="p-4">{book.genre?.name}</td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleEdit(book)}
                                                    className="text-blue-600 hover:text-blue-800 mr-4"
                                                >
                                                    <Edit2 className="w-5 h-5 inline" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(book._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="w-5 h-5 inline" />
                                                </button>
                                            </td>
                                        </tr>
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

export default ManageBooks;