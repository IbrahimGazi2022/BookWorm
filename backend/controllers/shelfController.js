import Shelf from "../models/shelfModel.js";
import Book from "../models/bookModel.js";
import Review from "../models/reviewModel.js";

// ADD BOOK TO SHELF
export const addToShelf = async (req, res) => {
    try {
        const { bookId, shelfType, totalPages } = req.body;
        const userId = req.user._id;

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
                existingShelf.pagesRead = 0;
            }
            if (totalPages) {
                existingShelf.totalPages = totalPages;
            }
            await existingShelf.save();
            return res.status(200).json({ message: "Book moved to " + shelfType, shelf: existingShelf });
        }

        // CREATE NEW SHELF ENTRY
        const shelf = await Shelf.create({
            user: userId,
            book: bookId,
            shelfType,
            pagesRead: 0,
            totalPages: totalPages || 0
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
        const { pagesRead, totalPages } = req.body;
        const userId = req.user._id;

        const shelf = await Shelf.findOne({ _id: shelfId, user: userId });
        if (!shelf) {
            return res.status(404).json({ message: "Shelf entry not found" });
        }

        // UPDATE PAGES
        if (pagesRead !== undefined) {
            shelf.pagesRead = Math.max(0, pagesRead);
        }
        if (totalPages !== undefined) {
            shelf.totalPages = Math.max(0, totalPages);
        }

        // AUTO MOVE TO READ IF COMPLETED
        if (shelf.totalPages > 0 && shelf.pagesRead >= shelf.totalPages && shelf.shelfType === "currentlyReading") {
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


// GET USER READING STATS
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentYear = new Date().getFullYear();

        // GET ALL READ BOOKS
        const readBooks = await Shelf.find({
            user: userId,
            shelfType: "read"
        }).populate({
            path: "book",
            populate: { path: "genre" }
        });

        // 1. BOOKS READ THIS YEAR
        const booksThisYear = readBooks.filter(shelf => {
            return new Date(shelf.updatedAt).getFullYear() === currentYear;
        }).length;

        // 2. TOTAL PAGES READ
        const totalPages = readBooks.reduce((sum, shelf) => {
            return sum + (shelf.totalPages || 0);
        }, 0);

        // 3. AVERAGE RATING GIVEN
        const userReviews = await Review.find({ user: userId, status: "Approved" });
        const avgRating = userReviews.length > 0
            ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
            : 0;

        // 4. FAVORITE GENRE BREAKDOWN
        const genreCount = {};
        readBooks.forEach(shelf => {
            if (shelf.book && shelf.book.genre) {
                const genreName = shelf.book.genre.name;
                genreCount[genreName] = (genreCount[genreName] || 0) + 1;
            }
        });

        const favoriteGenres = Object.entries(genreCount)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // 5. READING STREAK (days with progress updates)
        const progressUpdates = await Shelf.find({
            user: userId,
            shelfType: "currentlyReading",
            pagesRead: { $gt: 0 }
        }).sort({ updatedAt: -1 });

        let streak = 0;
        let lastDate = null;

        for (let shelf of progressUpdates) {
            const updateDate = new Date(shelf.updatedAt).toDateString();

            if (!lastDate) {
                streak = 1;
                lastDate = updateDate;
            } else if (lastDate !== updateDate) {
                const dayDiff = Math.floor((new Date(lastDate) - new Date(updateDate)) / (1000 * 60 * 60 * 24));
                if (dayDiff === 1) {
                    streak++;
                    lastDate = updateDate;
                } else {
                    break;
                }
            }
        }

        // 6. MONTHLY BOOKS READ (for bar chart)
        const monthlyData = Array(12).fill(0).map((_, i) => ({
            month: new Date(currentYear, i).toLocaleString('default', { month: 'short' }),
            books: 0
        }));

        readBooks.forEach(shelf => {
            const month = new Date(shelf.updatedAt).getMonth();
            const year = new Date(shelf.updatedAt).getFullYear();
            if (year === currentYear) {
                monthlyData[month].books++;
            }
        });

        // 7. PAGES OVER TIME (for line chart) - Last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentProgress = await Shelf.find({
            user: userId,
            updatedAt: { $gte: thirtyDaysAgo }
        }).sort({ updatedAt: 1 });

        const pagesOverTime = [];
        let cumulativePages = 0;

        recentProgress.forEach(shelf => {
            cumulativePages += (shelf.pagesRead || 0);
            pagesOverTime.push({
                date: new Date(shelf.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                pages: cumulativePages
            });
        });

        res.status(200).json({
            booksThisYear,
            totalPages,
            avgRating: parseFloat(avgRating),
            totalBooksRead: readBooks.length,
            readingStreak: streak,
            favoriteGenres,
            monthlyBooks: monthlyData,
            pagesOverTime
        });
    } catch (error) {
        console.error("Get User Stats Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};