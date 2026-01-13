import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";

const Navbar = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [imageError, setImageError] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        setShowDropdown(false);

        // Force reload to clear all state
        window.location.href = "/";
    };

    const getPhotoUrl = () => {
        if (!user?.photo) return null;
        return user.photo.startsWith('http')
            ? user.photo
            : `${import.meta.env.VITE_API_URL}/${user.photo}`;
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between px-6 py-4">
                {/* LEFT - PROJECT NAME */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-secondary">📚 BookWorm</span>
                </div>

                {/* RIGHT - USER MENU */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors"
                    >
                        {!imageError && getPhotoUrl() ? (
                            <img
                                src={getPhotoUrl()}
                                alt={user?.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-secondary"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg border-2 border-secondary">
                                {user?.name?.charAt(0).toUpperCase() || '👤'}
                            </div>
                        )}
                        <div className="text-left hidden md:block">
                            <p className="font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.role}</p>
                        </div>
                    </button>

                    {/* DROPDOWN */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-red-600 font-semibold rounded-lg"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;