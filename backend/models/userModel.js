import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
      default: "uploads/default-avatar.jpg"
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User"
    },
    readingGoal: {
      year: {
        type: Number,
        default: () => new Date().getFullYear()
      },
      target: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;