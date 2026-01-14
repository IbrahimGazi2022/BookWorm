import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, LayoutDashboard, BookOpen, Library, Youtube, Book, Tag, Users, MessageSquare } from "lucide-react";

// --- MENU CONFIGURATIONS ---
const USER_MENU_ITEMS = [
    { id: 1, name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: 2, name: "My Library", icon: Library, path: "/my-library" },
    { id: 3, name: "Browse Books", icon: BookOpen, path: "/browse" },
    { id: 4, name: "Tutorials", icon: Youtube, path: "/tutorials" },
];

const ADMIN_MENU_ITEMS = [
    { id: 1, name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { id: 2, name: "Manage Books", icon: Book, path: "/admin/books" },
    { id: 3, name: "Manage Genres", icon: Tag, path: "/admin/genres" },
    { id: 4, name: "Manage Users", icon: Users, path: "/admin/users" },
    { id: 5, name: "Moderate Reviews", icon: MessageSquare, path: "/admin/reviews" },
    { id: 6, name: "Manage Tutorials", icon: Youtube, path: "/admin/tutorials" },
];

// --- MOBILE OVERLAY COMPONENT ---
const MobileOverlay = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
    );
};

// --- MENU ITEM COMPONENT ---
const NavItem = ({ item, isActive, onClick }) => {
    const Icon = item.icon;
    return (
        <li>
            <button
                onClick={() => onClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all cursor-pointer 
                    ${isActive ? "bg-secondary text-white shadow-md" : "text-gray-600 hover:bg-gray-100 hover:text-secondary"}`}>
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                {item.name}
            </button>
        </li>
    );
};

// --- MAIN SIDEBAR COMPONENT ---
const Sidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const menuItems = user?.role === "Admin" ? ADMIN_MENU_ITEMS : USER_MENU_ITEMS;

    const handleNavClick = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <>
            <MobileOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />

            <aside className={`bg-white shadow-xl fixed left-0 top-0 bottom-0 w-64 z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:top-16 lg:z-30`}>
                    
                {/* --- MOBILE HEADER SECTION --- */}
                <div className="flex items-center justify-between p-5 lg:hidden border-b">
                    <span className="font-bold text-secondary text-xl">Menu</span>
                    <button onClick={() => setIsOpen(false)} className="cursor-pointer">
                        <X className="w-8 h-7 text-gray-500" />
                    </button>
                </div>

                {/* --- NAVIGATION SECTION --- */}
                <nav className="p-4 lg:mt-4">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <NavItem
                                key={item.id}
                                item={item}
                                isActive={location.pathname === item.path}
                                onClick={handleNavClick}
                            />
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;