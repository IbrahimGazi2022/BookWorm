import express from "express";
import {
    createTutorial,
    getAllTutorials,
    getTutorialById,
    updateTutorial,
    deleteTutorial,
} from "../controllers/tutorialController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllTutorials);
router.get("/:id", getTutorialById);

// ADMIN ROUTES
router.post("/", protect, adminOnly, createTutorial);
router.put("/:id", protect, adminOnly, updateTutorial);
router.delete("/:id", protect, adminOnly, deleteTutorial);

export default router;