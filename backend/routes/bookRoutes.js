import express from "express";
import {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    getRecommendations
} from "../controllers/bookController.js";
import upload from "../middlewares/upload.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", upload.single("coverImage"), createBook);
router.get("/", getAllBooks);
router.get("/recommendations", protect, getRecommendations);
router.get("/:id", getBookById);
router.put("/:id", upload.single("coverImage"), updateBook);
router.delete("/:id", deleteBook);

export default router;