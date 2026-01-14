import React, { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlice";

// --- LOGO COMPONENT ---
const Logo = ({ toggleSidebar }) => {
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden cursor-pointer"
            >
                <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <span className="text-xl md:text-2xl font-bold text-secondary">📚 BookWorm</span>
        </div>
    );
};

// --- USER PROFILE IMAGE COMPONENT ---
const UserAvatar = ({ user, imageError, setImageError, getPhotoUrl }) => {
    const photoUrl = getPhotoUrl();

    if (!imageError && photoUrl) {
        return (
            <img
                src={photoUrl}
                alt={user?.name}
                onError={() => setImageError(true)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-secondary"
            />
        );
    }

    return (
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-sm md:text-lg border-2 border-secondary">
            {user?.name?.charAt(0).toUpperCase() || '👤'}
        </div>
    );
};

// --- DROPDOWN MENU COMPONENT ---
const UserDropdown = ({ handleLogout }) => {
    return (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 overflow-hidden">
            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-red-600 font-semibold cursor-pointer transition-colors"
            >
                <LogOut className="w-5 h-5" />
                Logout
            </button>
        </div>
    );
};

// --- MAIN NAVBAR COMPONENT ---
const Navbar = ({ toggleSidebar }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [imageError, setImageError] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        setShowDropdown(false);
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
            <div className="flex items-center justify-between px-4 md:px-6 py-4">

                <Logo toggleSidebar={toggleSidebar} />

                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 md:gap-3 hover:bg-gray-100 rounded-lg px-2 md:px-4 py-2 transition-colors cursor-pointer"
                    >
                        <UserAvatar
                            user={user}
                            imageError={imageError}
                            setImageError={setImageError}
                            getPhotoUrl={getPhotoUrl}
                        />

                        <div className="text-left hidden sm:block">
                            <p className="font-semibold text-gray-800 text-sm md:text-base leading-none">
                                {user?.name}
                            </p>
                            <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                                {user?.role}
                            </p>
                        </div>
                    </button>

                    {showDropdown && (
                        <UserDropdown handleLogout={handleLogout} />
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;