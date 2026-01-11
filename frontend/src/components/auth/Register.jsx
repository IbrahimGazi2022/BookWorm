import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, X } from "lucide-react";


// --- IMAGE UPLOAD COMPONENT ---
const ImageUpload = () => {
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- REMOVE IMAGE FUNCTION ---
    const removeImage = () => {
        setImagePreview(null);
    };

    return (
        <div className="flex flex-col items-center mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Your Picture
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
                        className="absolute -top-2 -right-2 bg-secondary text-white rounded-full p-1 hover:bg-red-700 transition-colors shadow-md"
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
    );
};

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-primary py-8 px-4">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                    Create Account
                </h2>

                <form className="space-y-4">
                    {/* --- IMAGE UPLOAD --- */}
                    <ImageUpload />

                    {/* --- NAME INPUTS --- */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name *
                            </label>
                            <input
                                type="text"
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
                                placeholder="Doe"
                                autoComplete="family-name"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    {/* --- EMAIL INPUTS --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                        />
                    </div>

                    {/* --- PASSWORD INPUTS --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <input
                            type="password"
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
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                        />
                    </div>

                    {/* --- REGISTER BUTTON --- */}
                    <button
                        type="submit"
                        className="w-full bg-secondary text-white py-3 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] font-bold tracking-wide uppercase hover:bg-[#2a3d28]"
                    >
                        Register
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