import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
    try {
        // GET DATA FROM REQUEST BODY
        const { name, email, password } = req.body;

        // CHECK IF ALL FIELDS ARE PROVIDED
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // CHECK IF PHOTO IS UPLOADED
        if (!req.file) {
            return res.status(400).json({ message: "Photo is required" });
        }

        // CHECK IF USER ALREADY EXISTS
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // HASH PASSWORD BEFORE SAVING
        const hashedPassword = await bcrypt.hash(password, 10);

        // GET PHOTO PATH FROM MULTER
        const photoPath = req.file.path;

        // CREATE NEW USER IN DATABASE
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            photo: photoPath
        });

        // SEND SUCCESS RESPONSE
        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                photo: newUser.photo,
            },
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const loginUser = async (req, res) => {
    try {
        // CHECK EMAIL AND PASSWORD
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // CHECK USER EXISTS
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // CHECK PASSWORD VALID
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // SEND TOKEN
        const token = generateToken(user._id);

        // SEND RESPONSE
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// GET ALL USERS (ADMIN ONLY)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json({ users });
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// UPDATE USER ROLE (ADMIN ONLY)
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        // CHECK IF ROLE IS VALID
        if (!role || !["User", "Admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // FIND USER AND UPDATE ROLE
        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User role updated successfully",
            user
        });
    } catch (error) {
        console.error("Update Role Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};