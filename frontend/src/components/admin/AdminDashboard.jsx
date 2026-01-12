import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Users, MessageSquare, Tag, Plus, TrendingUp } from 'lucide-react';
import { getAllUsers } from '../../services/userService';
import { getAllBooks } from '../../services/bookService';
import { getAllGenres } from '../../services/genreService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([
        { id: 1, title: 'Total Books', value: '0', icon: Book, color: 'bg-blue-500', change: '+0%' },
        { id: 2, title: 'Total Users', value: '0', icon: Users, color: 'bg-green-500', change: '+0%' },
        { id: 3, title: 'Pending Reviews', value: '0', icon: MessageSquare, color: 'bg-yellow-500', change: '+0' },
        { id: 4, title: 'Total Genres', value: '0', icon: Tag, color: 'bg-purple-500', change: '+0' },
    ]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const booksData = await getAllBooks();
            const genresData = await getAllGenres();
            const usersData = await getAllUsers();
            
            setStats([
                { id: 1, title: 'Total Books', value: booksData.books.length.toString(), icon: Book, color: 'bg-blue-500', change: '+12%' },
                { id: 2, title: 'Total Users', value: usersData.users.length.toString(), icon: Users, color: 'bg-green-500', change: '+8%' },
                { id: 3, title: 'Pending Reviews', value: '0', icon: MessageSquare, color: 'bg-yellow-500', change: '+5' },
                { id: 4, title: 'Total Genres', value: genresData.genres.length.toString(), icon: Tag, color: 'bg-purple-500', change: '+2' },
            ]);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const quickActions = [
        { id: 1, title: 'Add New Book', icon: Plus, link: '/admin/books', color: 'bg-secondary' },
        { id: 2, title: 'Manage Genres', icon: Tag, link: '/admin/genres', color: 'bg-secondary' },
        { id: 3, title: 'Moderate Reviews', icon: MessageSquare, link: '/admin/reviews', color: 'bg-secondary' },
        { id: 4, title: 'Manage Users', icon: Users, link: '/admin/users', color: 'bg-secondary' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-secondary mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with BookWorm today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="flex items-center text-sm text-green-600 font-semibold">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-secondary">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-secondary mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => navigate(action.link)}
                            className={`${action.color} text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center gap-3`}
                        >
                            <action.icon className="w-8 h-8" />
                            <span className="font-semibold">{action.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;