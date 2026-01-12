import Book from "../models/bookModel.js";

// CREATE BOOK (Admin only)
export const createBook = async (req, res) => {
    try {
        const { title, author, genre, description } = req.body;

        if (!title || !author || !genre || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Cover image is required" });
        }

        const coverImage = req.file.path;

        const book = await Book.create({
            title,
            author,
            genre,
            description,
            coverImage
        });

        res.status(201).json({ message: "Book created successfully", book });
    } catch (error) {
        console.error("Create Book Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET ALL BOOKS
export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate("genre", "name").sort({ createdAt: -1 });
        res.status(200).json({ books });
    } catch (error) {
        console.error("Get Books Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET SINGLE BOOK
export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id).populate("genre", "name");

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ book });
    } catch (error) {
        console.error("Get Book Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// UPDATE BOOK (Admin only)
export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, genre, description } = req.body;

        const updateData = { title, author, genre, description };

        if (req.file) {
            updateData.coverImage = req.file.path;
        }

        const book = await Book.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        }).populate("genre", "name");

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully", book });
    } catch (error) {
        console.error("Update Book Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE BOOK (Admin only)
export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Delete Book Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};