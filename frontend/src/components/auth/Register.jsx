import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, X, Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from "../../services/authService";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- HANDLE INPUT CHANGE ---
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // --- HANDLE IMAGE UPLOAD ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // VALIDATE FILE SIZE (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }

            // VALIDATE FILE TYPE
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Only JPG, PNG, and GIF files are allowed");
                return;
            }

            setImageFile(file);

            // PREVIEW
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- REMOVE IMAGE ---
    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    // --- HANDLE SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDATION
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (!imageFile) {
            toast.error("Please upload a profile photo");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        // CREATE FORMDATA
        const data = new FormData();
        data.append("name", `${formData.firstName} ${formData.lastName}`);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("photo", imageFile);

        try {
            setLoading(true);
            const response = await registerUser(data);
            console.log(data);
            toast.success("Registration successful! Redirecting to login...");

            // RESET FORM
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
            setImageFile(null);
            setImagePreview(null);

            // REDIRECT TO LOGIN AFTER 1 SECONDS
            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            console.error("Registration Error:", error);
            if (error.response) {
                toast.error(error.response.data.message || "Registration failed");
            } else if (error.request) {
                toast.error("No response from server. Please try again.");
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary py-8 px-4">
            {/* --- TOAST CONTAINER --- */}
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* --- IMAGE UPLOAD SECTION --- */}
                    <div className="flex flex-col items-center mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Upload Your Picture *
                        </label>

                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-secondary shadow-lg"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition-colors shadow-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-secondary transition-colors bg-gray-50 hover:bg-gray-100">
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500 text-center px-2">
                                    Upload Photo
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            JPG, PNG or GIF (Max 5MB)
                        </p>
                    </div>

                    {/* --- NAME INPUTS --- */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                autoComplete="given-name"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                autoComplete="family-name"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    {/* --- EMAIL INPUT --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                        />
                    </div>

                    {/* --- PASSWORD INPUT --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                        />
                    </div>

                    {/* --- CONFIRM PASSWORD INPUT --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                        />
                    </div>

                    {/* --- REGISTER BUTTON --- */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-secondary text-white py-3 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] font-bold tracking-wide uppercase hover:bg-[#2a3d28] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Registering...
                            </>
                        ) : (
                            "Register"
                        )}
                    </button>

                    {/* --- LOGIN LINK --- */}
                    <div className="text-center text-sm text-gray-500 pt-2">
                        Have an account?{" "}
                        <Link
                            to="/"
                            className="text-secondary font-bold hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;