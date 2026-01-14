import { Loader, Mail, Lock, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { loginUser } from "../../services/authService";
import { setProfile } from "../../redux/slices/authSlice";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // --- HANDLE INPUT CHANGE ---
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // --- QUICK LOGIN HANDLERS ---
    const fillDemoAdmin = () => {
        setFormData({
            email: "admin@admin.com",
            password: "123456",
        });
        toast.info("Admin credentials filled!");
    };

    const fillDemoUser = () => {
        setFormData({
            email: "mh.ibrahimgazi@gmail.com",
            password: "123456",
        });
        toast.info("User credentials filled!");
    };

    // --- HANDLE SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            const data = await loginUser(formData);

            // Redux store আপডেট
            dispatch(setProfile(data.user));

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Login successful!");

            // ROLE-BASED REDIRECT WITH REFRESH
            setTimeout(() => {
                const targetPath = data.user.role === "Admin" ? "/admin/dashboard" : "/my-library";
                window.location.href = targetPath;
            }, 1000);

        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4 md:p-6">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-500">

                {/* TOP DECORATION/HEADER */}
                <div className="bg-secondary p-8 text-white text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-white/80 text-xs md:text-sm font-medium">
                            Enter your credentials to access your library
                        </p>
                    </div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                </div>

                <div className="p-6 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* --- EMAIL INPUT --- */}
                        <div className="space-y-1.5">
                            <label className="text-xs md:text-sm font-bold text-gray-700 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    required
                                    className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:bg-white transition-all text-sm md:text-base"
                                />
                            </div>
                        </div>

                        {/* --- PASSWORD INPUT --- */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs md:text-sm font-bold text-gray-700">
                                    Password
                                </label>
                                <Link to="#" className="text-[11px] md:text-xs font-bold text-secondary hover:underline">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:bg-white transition-all text-sm md:text-base"
                                />
                            </div>
                        </div>

                        {/* --- LOGIN BUTTON --- */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-secondary text-white py-3.5 md:py-4 rounded-2xl transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/40 active:scale-[0.98] font-bold text-sm md:text-base uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
                                </>
                            )}
                        </button>

                        {/* --- DEMO LOGIN QUICK ACCESS --- */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                type="button"
                                onClick={fillDemoAdmin}
                                className="bg-gray-50 text-gray-600 py-3 rounded-xl border border-dashed border-gray-300 hover:bg-gray-100 hover:border-secondary/30 transition-all font-bold text-[12px] uppercase tracking-tighter flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <ShieldCheck className="w-3.5 h-3.5 text-secondary font-bold" />
                                Admin Demo
                            </button>
                            <button
                                type="button"
                                onClick={fillDemoUser}
                                className="bg-gray-50 text-gray-600 py-3 rounded-xl border border-dashed border-gray-300 hover:bg-gray-100 hover:border-secondary/30 transition-all font-bold text-[12px] uppercase tracking-tighter flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <UserCheck className="w-3.5 h-3.5 text-secondary font-bold" />
                                User Demo
                            </button>
                        </div>

                        {/* --- REGISTER LINK --- */}
                        <div className="text-center pt-2">
                            <p className="text-xs md:text-sm text-gray-500 font-medium">
                                New to our library?{" "}
                                <Link
                                    to="/register"
                                    className="text-secondary font-bold hover:text-secondary/80 transition-colors ml-1"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;