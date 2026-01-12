import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: String,
            required: true,
            trim: true
        },
        genre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Genre",
            required: true
        },
        description: {
            type: String,
            required: true
        },
        coverImage: {
            type: String,
            required: true
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;