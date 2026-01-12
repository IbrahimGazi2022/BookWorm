import mongoose from "mongoose";

const tutorialSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        youtubeUrl: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Tutorial = mongoose.model("Tutorial", tutorialSchema);
export default Tutorial;