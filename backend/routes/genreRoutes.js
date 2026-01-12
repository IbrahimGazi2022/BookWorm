import express from "express";
import {
    createGenre,
    getAllGenres,
    updateGenre,
    deleteGenre
} from "../controllers/genreController.js";

const router = express.Router();

router.post("/", createGenre);
router.get("/", getAllGenres);
router.put("/:id", updateGenre);
router.delete("/:id", deleteGenre);

export default router;