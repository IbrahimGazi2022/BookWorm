import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        }
    },
    { timestamps: true }
);

const Genre = mongoose.model("Genre", genreSchema);
export default Genre;