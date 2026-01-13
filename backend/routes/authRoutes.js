import express from "express";
import { registerUser, loginUser, getAllUsers, updateUserRole, getReadingGoal, setReadingGoal } from "../controllers/authController.js";
import upload from "../middlewares/upload.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// --- AUTH ROUTES ---
router.post("/register", upload.single("photo"), registerUser);
router.post("/login", loginUser);

// --- USER ROUTES ---
router.get("/reading-goal", protect, getReadingGoal);
router.put("/reading-goal", protect, setReadingGoal);

// --- ADMIN ROUTES ---
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:userId/role", protect, adminOnly, updateUserRole);

export default router;