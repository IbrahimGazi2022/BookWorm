import Book from "../models/bookModel.js";
import Shelf from "../models/shelfModel.js";
import Review from "../models/reviewModel.js";
import Genre from "../models/genreModel.js";
import User from "../models/userModel.js";

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


// GET PERSONALIZED RECOMMENDATIONS (USER)
export const getRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;

        // GET USER'S READ BOOKS
        const readBooks = await Shelf.find({
            user: userId,
            shelfType: "read"
        }).populate({
            path: "book",
            populate: { path: "genre" }
        });

        let recommendations = [];

        // IF USER HAS 3+ READ BOOKS - USE SMART ALGORITHM
        if (readBooks.length >= 3) {
            // COUNT GENRE FREQUENCY
            const genreCount = {};
            readBooks.forEach(shelf => {
                const genreId = shelf.book.genre._id.toString();
                genreCount[genreId] = (genreCount[genreId] || 0) + 1;
            });

            // GET TOP 3 GENRES
            const topGenres = Object.entries(genreCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([genreId]) => genreId);

            // GET USER'S AVERAGE RATING
            const userReviews = await Review.find({ user: userId });
            const avgUserRating = userReviews.length > 0
                ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length
                : 3;

            // GET BOOKS FROM FAVORITE GENRES (EXCLUDE ALREADY READ)
            const readBookIds = readBooks.map(shelf => shelf.book._id.toString());

            const genreBooks = await Book.find({
                genre: { $in: topGenres },
                _id: { $nin: readBookIds }
            }).populate("genre", "name").limit(50);

            // GET REVIEW STATS FOR EACH BOOK
            const booksWithStats = await Promise.all(
                genreBooks.map(async (book) => {
                    const reviews = await Review.find({
                        book: book._id,
                        status: "Approved"
                    });

                    const avgRating = reviews.length > 0
                        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                        : 0;

                    const shelvedCount = await Shelf.countDocuments({ book: book._id });

                    // CALCULATE SCORE (closer to user's avg rating + popularity)
                    const ratingDiff = Math.abs(avgRating - avgUserRating);
                    const score = (5 - ratingDiff) * 0.6 + (shelvedCount * 0.4);

                    return {
                        ...book.toObject(),
                        avgRating,
                        shelvedCount,
                        score,
                        reason: `Matches your preference for ${book.genre.name} (${genreCount[book.genre._id]} books read)`
                    };
                })
            );

            // SORT BY SCORE AND TAKE TOP 18
            recommendations = booksWithStats
                .sort((a, b) => b.score - a.score)
                .slice(0, 18);
        }

        // FALLBACK - IF LESS THAN 3 BOOKS OR NOT ENOUGH RECOMMENDATIONS
        if (recommendations.length < 12) {
            const readBookIds = readBooks.map(shelf => shelf.book._id.toString());

            // GET POPULAR BOOKS (MOST SHELVED + HIGH RATED)
            const popularBooks = await Book.find({
                _id: { $nin: readBookIds }
            }).populate("genre", "name").limit(30);

            const popularWithStats = await Promise.all(
                popularBooks.map(async (book) => {
                    const reviews = await Review.find({
                        book: book._id,
                        status: "Approved"
                    });

                    const avgRating = reviews.length > 0
                        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                        : 0;

                    const shelvedCount = await Shelf.countDocuments({ book: book._id });

                    return {
                        ...book.toObject(),
                        avgRating,
                        shelvedCount,
                        score: avgRating * 0.5 + shelvedCount * 0.5,
                        reason: "Popular among readers"
                    };
                })
            );

            // COMBINE WITH EXISTING RECOMMENDATIONS
            const combined = [...recommendations, ...popularWithStats]
                .sort((a, b) => b.score - a.score)
                .slice(0, 18);

            recommendations = combined;
        }

        res.status(200).json({ recommendations });
    } catch (error) {
        console.error("Get Recommendations Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET ADMIN STATS
export const getAdminStats = async (req, res) => {
    try {
        // TOTAL BOOKS COUNT
        const totalBooks = await Book.countDocuments();

        // TOTAL USERS COUNT
        const totalUsers = await User.countDocuments();

        // BOOKS PER GENRE
        const booksPerGenre = await Book.aggregate([
            {
                $group: {
                    _id: "$genre",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "genres",
                    localField: "_id",
                    foreignField: "_id",
                    as: "genreInfo"
                }
            },
            {
                $unwind: "$genreInfo"
            },
            {
                $project: {
                    name: "$genreInfo.name",
                    value: "$count"
                }
            }
        ]);

        res.status(200).json({
            totalBooks,
            totalUsers,
            booksPerGenre
        });
    } catch (error) {
        console.error("Get Admin Stats Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};