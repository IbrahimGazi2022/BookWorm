import Shelf from "../models/shelfModel.js";
import Book from "../models/bookModel.js";

// ADD BOOK TO SHELF
export const addToShelf = async (req, res) => {
    try {
        const { bookId, shelfType } = req.body;
        const userId = req.user._id; // From auth middleware

        if (!bookId || !shelfType) {
            return res.status(400).json({ message: "Book ID and shelf type are required" });
        }

        // CHECK IF BOOK EXISTS
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // CHECK IF ALREADY IN SHELF
        const existingShelf = await Shelf.findOne({ user: userId, book: bookId });

        if (existingShelf) {
            // UPDATE SHELF TYPE
            existingShelf.shelfType = shelfType;
            if (shelfType === "wantToRead") {
                existingShelf.progress = 0;
            }
            await existingShelf.save();
            return res.status(200).json({ message: "Book moved to " + shelfType, shelf: existingShelf });
        }

        // CREATE NEW SHELF ENTRY
        const shelf = await Shelf.create({
            user: userId,
            book: bookId,
            shelfType,
            progress: 0
        });

        res.status(201).json({ message: "Book added to shelf", shelf });
    } catch (error) {
        console.error("Add to Shelf Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET USER'S SHELVES
export const getUserShelves = async (req, res) => {
    try {
        const userId = req.user._id;

        const shelves = await Shelf.find({ user: userId })
            .populate({
                path: "book",
                populate: { path: "genre", select: "name" }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ shelves });
    } catch (error) {
        console.error("Get Shelves Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// UPDATE READING PROGRESS
export const updateProgress = async (req, res) => {
    try {
        const { shelfId } = req.params;
        const { progress } = req.body;
        const userId = req.user._id;

        if (progress < 0 || progress > 100) {
            return res.status(400).json({ message: "Progress must be between 0 and 100" });
        }

        const shelf = await Shelf.findOne({ _id: shelfId, user: userId });
        if (!shelf) {
            return res.status(404).json({ message: "Shelf entry not found" });
        }

        shelf.progress = progress;

        // AUTO MOVE TO READ IF 100%
        if (progress === 100 && shelf.shelfType === "currentlyReading") {
            shelf.shelfType = "read";
        }

        await shelf.save();

        res.status(200).json({ message: "Progress updated", shelf });
    } catch (error) {
        console.error("Update Progress Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// REMOVE FROM SHELF
export const removeFromShelf = async (req, res) => {
    try {
        const { shelfId } = req.params;
        const userId = req.user._id;

        const shelf = await Shelf.findOneAndDelete({ _id: shelfId, user: userId });
        if (!shelf) {
            return res.status(404).json({ message: "Shelf entry not found" });
        }

        res.status(200).json({ message: "Book removed from shelf" });
    } catch (error) {
        console.error("Remove from Shelf Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};