import React, { useState } from "react";
import { Book, BookOpen, CheckCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";

const MyLibrary = () => {
    const [activeShelf, setActiveShelf] = useState("wantToRead");

    const shelves = [
        { id: "wantToRead", name: "Want to Read", icon: Book, color: "bg-blue-500" },
        { id: "currentlyReading", name: "Currently Reading", icon: BookOpen, color: "bg-yellow-500" },
        { id: "read", name: "Read", icon: CheckCircle, color: "bg-green-500" },
    ];

    // DUMMY DATA - pore backend theke fetch korbo
    const books = {
        wantToRead: [],
        currentlyReading: [],
        read: [],
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-secondary mb-2">My Library</h1>
                    <p className="text-gray-600">Organize and track your reading journey</p>
                </div>

                {/* SHELF TABS */}
                <div className="bg-white rounded-lg shadow-md mb-8">
                    <div className="flex border-b">
                        {shelves.map((shelf) => (
                            <button
                                key={shelf.id}
                                onClick={() => setActiveShelf(shelf.id)}
                                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-colors ${activeShelf === shelf.id
                                        ? "border-b-4 border-secondary text-secondary"
                                        : "text-gray-600 hover:text-secondary"
                                    }`}
                            >
                                <shelf.icon className="w-5 h-5" />
                                {shelf.name}
                                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                                    {books[shelf.id].length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* SHELF CONTENT */}
                    <div className="p-8">
                        {books[activeShelf].length === 0 ? (
                            <div className="text-center py-12">
                                <div className={`${shelves.find(s => s.id === activeShelf).color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    {React.createElement(shelves.find(s => s.id === activeShelf).icon, {
                                        className: "w-8 h-8 text-white"
                                    })}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    No books in this shelf
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Start adding books from the Browse page!
                                </p>
                                <button
                                    onClick={() => window.location.href = "/browse"}
                                    className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                                >
                                    Browse Books
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {/* Books will be displayed here */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyLibrary;