import express from "express";
import {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
} from "../controllers/bookController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", upload.single("coverImage"), createBook);
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.put("/:id", upload.single("coverImage"), updateBook);
router.delete("/:id", deleteBook);

export default router;