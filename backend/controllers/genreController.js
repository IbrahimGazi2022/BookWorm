import Genre from "../models/genreModel.js";

// CREATE GENRE (Admin only)
export const createGenre = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Genre name is required" });
        }

        const existingGenre = await Genre.findOne({ name });
        if (existingGenre) {
            return res.status(409).json({ message: "Genre already exists" });
        }

        const genre = await Genre.create({ name });
        res.status(201).json({ message: "Genre created successfully", genre });
    } catch (error) {
        console.error("Create Genre Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET ALL GENRES
export const getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find().sort({ name: 1 });
        res.status(200).json({ genres });
    } catch (error) {
        console.error("Get Genres Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// UPDATE GENRE (Admin only)
export const updateGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const genre = await Genre.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }

        res.status(200).json({ message: "Genre updated successfully", genre });
    } catch (error) {
        console.error("Update Genre Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE GENRE (Admin only)
export const deleteGenre = async (req, res) => {
    try {
        const { id } = req.params;

        const genre = await Genre.findByIdAndDelete(id);
        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }

        res.status(200).json({ message: "Genre deleted successfully" });
    } catch (error) {
        console.error("Delete Genre Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};