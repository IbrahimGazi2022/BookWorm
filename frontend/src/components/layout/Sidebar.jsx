import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    Library,
    Youtube,
    Book,
    Tag,
    Users,
    MessageSquare,
} from "lucide-react";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const userMenuItems = [
        { id: 1, name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { id: 2, name: "My Library", icon: Library, path: "/my-library" },
        { id: 3, name: "Browse Books", icon: BookOpen, path: "/browse" },
        { id: 4, name: "Tutorials", icon: Youtube, path: "/tutorials" },
    ];

    const adminMenuItems = [
        { id: 1, name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { id: 2, name: "Manage Books", icon: Book, path: "/admin/books" },
        { id: 3, name: "Manage Genres", icon: Tag, path: "/admin/genres" },
        { id: 4, name: "Manage Users", icon: Users, path: "/admin/users" },
        { id: 5, name: "Moderate Reviews", icon: MessageSquare, path: "/admin/reviews" },
        { id: 6, name: "Manage Tutorials", icon: Youtube, path: "/admin/tutorials" },
    ];

    const menuItems = user?.role === "Admin" ? adminMenuItems : userMenuItems;

    return (
        <aside className="bg-white shadow-lg fixed left-0 top-16 bottom-0 w-64 overflow-y-auto mt-8">
            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${isActive
                                            ? "bg-secondary text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;