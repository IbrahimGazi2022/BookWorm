import { Loader } from "lucide-react";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { loginUser } from "../../services/authService";


const Login = () => {
    const navigate = useNavigate();
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

    // --- HANDLE SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const data = await loginUser(formData);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Login successful! Redirecting...");

            setFormData({
                email: "",
                password: "",
            });

            // ROLE-BASED REDIRECT
            setTimeout(() => {
                if (data.user.role === "Admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/my-library");
                }
            }, 1500);

        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Login failed");
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
        <div className="min-h-screen flex items-center justify-center bg-primary">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                        />
                    </div>

                    {/* --- LOGIN BUTTON --- */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-secondary text-white py-3 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>

                    {/* --- REGISTER LINK --- */}
                    <div className="text-center text-sm text-gray-500 pt-2">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-secondary font-bold hover:underline"
                        >
                            Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;