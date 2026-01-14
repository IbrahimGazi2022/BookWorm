import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Upload, X, Loader, Camera, User, Mail, Lock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from "../../services/authService";
import { setUser } from "../../redux/slices/userSlice";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return toast.error("File size must be less than 5MB");
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
            if (!allowedTypes.includes(file.type)) return toast.error("Invalid file type");

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) return toast.error("All fields are required");
        if (!imageFile) return toast.error("Please upload a profile photo");
        if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
        if (formData.password.length < 6) return toast.error("Password too short");

        const data = new FormData();
        data.append("name", `${formData.firstName} ${formData.lastName}`);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("photo", imageFile);

        try {
            setLoading(true);
            const response = await registerUser(data);

            if (response.token && response.user) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
                dispatch(setUser(response.user));
            }

            toast.success("Account created! Redirecting...");
            setTimeout(() => navigate("/my-library"), 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4 md:p-8">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

            <div className="w-full max-w-2xl bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-500">

                <div className="hidden md:flex w-1/3 bg-secondary p-8 text-white flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold leading-tight mb-4">Join Our Library</h2>
                        <p className="text-white/70 text-sm">Create an account to manage your books, write reviews, and more.</p>
                    </div>
                    <div className="relative z-10 flex items-center gap-2 text-xs font-bold tracking-widest uppercase opacity-50">
                        <div className="w-8 h-px bg-white"></div>
                        Est. 2024
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="flex-1 p-6 md:p-10">
                    <div className="text-center md:text-left mb-8">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-800 md:hidden mb-2">Create Account</h2>
                        <p className="text-gray-500 text-sm md:text-base font-medium">Please fill in your details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex flex-col items-center md:items-start mb-6">
                            <div className="relative group">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover ring-4 ring-secondary/20 shadow-xl" />
                                        <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-all cursor-pointer">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all group">
                                        <Camera className="w-8 h-8 text-gray-300 group-hover:text-secondary transition-colors" />
                                        <span className="text-[10px] md:text-xs font-bold text-gray-400 mt-2">PHOTO</span>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 ml-1 italic">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all text-sm" required />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 ml-1 italic">Last Name</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all text-sm" required />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1 italic">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all text-sm" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 ml-1 italic">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all text-sm" required />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 ml-1 italic">Confirm</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all text-sm" required />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-secondary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-secondary/20 hover:shadow-secondary/40 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4 cursor-pointer">
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Create Account"}
                        </button>

                        <p className="text-center text-xs md:text-sm text-gray-500 font-medium pt-2">
                            Already have an account? <Link to="/" className="text-secondary font-bold hover:underline">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;