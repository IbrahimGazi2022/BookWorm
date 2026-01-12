import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import connectDB from "./DB/connectDB.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(
    cors({
        origin: ["http://localhost:5173", "https://book-worm-lime.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

connectDB();

app.get("/", (req, res) => {
    res.json("Backend Running");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Node Server Running In ${process.env.NODE_ENV} Mode On Port ${PORT}`);
});

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(
            `✅ Node Server Running In ${process.env.NODE_ENV} Mode on Port ${PORT}`
        );
    });
}

export default app;

