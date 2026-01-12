import React, { useState, useEffect } from "react";
import { Users, Shield, UserCog, Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getAllUsers, updateUserRole } from "../../services/userService";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data.users);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, currentRole) => {
        // PREVENT SELF ROLE CHANGE
        if (userId === currentUser._id) {
            toast.error("You cannot change your own role");
            return;
        }

        const newRole = currentRole === "Admin" ? "User" : "Admin";
        const action = newRole === "Admin" ? "Promote" : "Demote";

        if (!window.confirm(`Are you sure you want to ${action} this user to ${newRole}?`)) {
            return;
        }

        try {
            setUpdatingUserId(userId);
            await updateUserRole(userId, newRole);
            toast.success(`User ${action}d successfully`);
            fetchUsers(); // REFRESH LIST
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update role");
        } finally {
            setUpdatingUserId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-secondary" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-secondary" />
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            </div>

            {/* USERS TABLE */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Photo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <img
                                            src={user.photo.startsWith('http')
                                                ? user.photo
                                                : `${import.meta.env.VITE_API_URL}/${user.photo}`
                                            }
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">{user.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${user.role === "Admin"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {user.role === "Admin" && <Shield className="w-4 h-4" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleRoleChange(user._id, user.role)}
                                            disabled={updatingUserId === user._id || user._id === currentUser._id}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${user._id === currentUser._id
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : user.role === "Admin"
                                                    ? "bg-red-600 text-white hover:bg-red-700"
                                                    : "bg-green-600 text-white hover:bg-green-700"
                                                } disabled:opacity-50`}
                                        >
                                            {updatingUserId === user._id ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <UserCog className="w-4 h-4" />
                                            )}
                                            {user._id === currentUser._id
                                                ? "You"
                                                : user.role === "Admin"
                                                    ? "Demote"
                                                    : "Promote"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;