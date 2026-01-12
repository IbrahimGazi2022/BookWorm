import Tutorial from "../models/tutorialModel.js";

// CREATE TUTORIAL (ADMIN)
export const createTutorial = async (req, res) => {
    try {
        const { title, youtubeUrl, description, order } = req.body;

        if (!title || !youtubeUrl) {
            return res.status(400).json({ message: "Title and YouTube URL are required" });
        }

        const tutorial = await Tutorial.create({
            title,
            youtubeUrl,
            description,
            order: order || 0,
        });

        res.status(201).json({
            message: "Tutorial created successfully",
            tutorial,
        });
    } catch (error) {
        console.error("Create Tutorial Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET ALL TUTORIALS (PUBLIC)
export const getAllTutorials = async (req, res) => {
    try {
        const tutorials = await Tutorial.find({}).sort({ order: 1, createdAt: -1 });
        res.status(200).json({ tutorials });
    } catch (error) {
        console.error("Get Tutorials Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET SINGLE TUTORIAL (PUBLIC)
export const getTutorialById = async (req, res) => {
    try {
        const { id } = req.params;
        const tutorial = await Tutorial.findById(id);

        if (!tutorial) {
            return res.status(404).json({ message: "Tutorial not found" });
        }

        res.status(200).json({ tutorial });
    } catch (error) {
        console.error("Get Tutorial Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// UPDATE TUTORIAL (ADMIN)
export const updateTutorial = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, youtubeUrl, description, order } = req.body;

        const tutorial = await Tutorial.findByIdAndUpdate(
            id,
            { title, youtubeUrl, description, order },
            { new: true, runValidators: true }
        );

        if (!tutorial) {
            return res.status(404).json({ message: "Tutorial not found" });
        }

        res.status(200).json({
            message: "Tutorial updated successfully",
            tutorial,
        });
    } catch (error) {
        console.error("Update Tutorial Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE TUTORIAL (ADMIN)
export const deleteTutorial = async (req, res) => {
    try {
        const { id } = req.params;

        const tutorial = await Tutorial.findByIdAndDelete(id);

        if (!tutorial) {
            return res.status(404).json({ message: "Tutorial not found" });
        }

        res.status(200).json({ message: "Tutorial deleted successfully" });
    } catch (error) {
        console.error("Delete Tutorial Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};