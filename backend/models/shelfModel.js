import mongoose from "mongoose";

const shelfSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },
        shelfType: {
            type: String,
            enum: ["wantToRead", "currentlyReading", "read"],
            required: true
        },
        pagesRead: {
            type: Number,
            default: 0,
            min: 0
        },
        totalPages: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    { timestamps: true }
);

shelfSchema.index({ user: 1, book: 1 }, { unique: true });

const Shelf = mongoose.model("Shelf", shelfSchema);
export default Shelf;