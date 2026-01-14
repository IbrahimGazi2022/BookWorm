import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Book, Users, MessageSquare, Tag, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAdminStats } from '../../services/bookService';
import { getPendingReviews } from '../../services/reviewService';
import { setAdminData } from '../../redux/slices/adminSlice';

// --- CONSTANTS AND CONFIGURATIONS ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

// --- DASHBOARD HEADER COMPONENT ---
const DashboardHeader = () => {
    return (
        <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-secondary mb-2">Admin Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
    );
};

// --- STATS CARD COMPONENT ---
const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
        <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 hover:shadow-md transition-all border border-gray-100">
            <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className={`${stat.color} p-2.5 md:p-3 rounded-lg shadow-sm`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="flex items-center text-[10px] md:text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {stat.change}
                </span>
            </div>
            <h3 className="text-gray-500 text-xs md:text-sm font-semibold uppercase tracking-wider">{stat.title}</h3>
            <p className="text-2xl md:text-3xl font-extrabold text-secondary mt-1">{stat.value}</p>
        </div>
    );
};

// --- CHART SECTION COMPONENT ---
const GenreDistributionChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    const isMobile = window.innerWidth < 768;

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 mb-8 border border-gray-100">
            <h2 className="text-lg md:text-2xl font-bold text-secondary mb-6">Books by Genre</h2>
            <div className="h-75 md:h-100 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => isMobile ? `${(percent * 100).toFixed(0)}%` : `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={isMobile ? 70 : 120}
                            innerRadius={isMobile ? 40 : 60}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                        <Legend
                            iconType="circle"
                            wrapperStyle={{ fontSize: isMobile ? '10px' : '14px', paddingTop: '20px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// --- MAIN ADMIN DASHBOARD COMPONENT ---
const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { adminStats, booksPerGenre } = useSelector((state) => state.admin);

    useEffect(() => {
        if (!adminStats) {
            fetchStats();
        }
    }, [adminStats]);

    const fetchStats = async () => {
        try {
            const adminData = await getAdminStats();
            const reviewsData = await getPendingReviews();

            const statsArray = [
                { id: 1, title: 'Total Books', value: adminData.totalBooks.toString(), icon: Book, color: 'bg-blue-500', change: '+12%' },
                { id: 2, title: 'Total Users', value: adminData.totalUsers.toString(), icon: Users, color: 'bg-green-500', change: '+8%' },
                { id: 3, title: 'Pending Reviews', value: reviewsData.reviews.length.toString(), icon: MessageSquare, color: 'bg-yellow-500', change: `+${reviewsData.reviews.length}` },
                { id: 4, title: 'Total Genres', value: adminData.booksPerGenre.length.toString(), icon: Tag, color: 'bg-purple-500', change: '+2' },
            ];

            dispatch(setAdminData({
                stats: statsArray,
                genres: adminData.booksPerGenre
            }));
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    if (!adminStats) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-3 md:p-6 lg:p-8">
            <DashboardHeader />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                {adminStats.map((stat) => (
                    <StatCard key={stat.id} stat={stat} />
                ))}
            </div>
            <GenreDistributionChart data={booksPerGenre} />
        </div>
    );
};

export default AdminDashboard;