import express from "express";
import {
    addToShelf,
    getUserShelves,
    updateProgress,
    removeFromShelf,
    getUserStats
} from "../controllers/shelfController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToShelf);
router.get("/", protect, getUserShelves);
router.get("/stats", protect, getUserStats); 
router.put("/:shelfId/progress", protect, updateProgress);
router.delete("/:shelfId", protect, removeFromShelf);

export default router;