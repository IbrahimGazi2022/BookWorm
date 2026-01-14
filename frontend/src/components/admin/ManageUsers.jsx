import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Shield, UserCog, Loader, Calendar, Mail } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getAllUsers, updateUserRole } from "../../services/userService";
import { setAllUsers } from "../../redux/slices/adminSlice";

const RoleBadge = ({ role }) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
        {role === "Admin" && <Shield className="w-3 h-3 md:w-3.5 md:h-3.5" />}
        {role}
    </span>
);

const UserCard = ({ user, onRoleChange, isUpdating, isCurrentUser }) => (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
            <img
                src={user.photo.startsWith('http') ? user.photo : `${import.meta.env.VITE_API_URL}/${user.photo}`}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-50"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight">{user.name}</h3>
                    {isCurrentUser && <span className="text-[10px] bg-gray-100 px-1.5 rounded text-gray-400 font-bold">YOU</span>}
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                    <circle className="w-3 h-3" />
                    <span className="truncate max-w-37.5">{user.email}</span>
                </div>
            </div>
            <RoleBadge role={user.role} />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                <Calendar className="w-3 h-3" />
                Joined {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <button
                onClick={() => onRoleChange(user._id, user.role)}
                disabled={isUpdating || isCurrentUser}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${isCurrentUser ? "bg-gray-100 text-gray-300" :
                    user.role === "Admin" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                    } disabled:opacity-50`}
            >
                {isUpdating ? <Loader className="w-3 h-3 animate-spin" /> : <UserCog className="w-4 h-4" />}
                {user.role === "Admin" ? "Demote" : "Promote"}
            </button>
        </div>
    </div>
);

const ManageUsers = () => {
    const dispatch = useDispatch();
    const { allUsers } = useSelector((state) => state.admin);
    const [loading, setLoading] = useState(false);
    const [updatingUserId, setUpdatingUserId] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (allUsers.length === 0) {
            fetchUsers();
        }
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            dispatch(setAllUsers(data.users));
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, currentRole) => {
        if (userId === currentUser._id) return toast.error("Self-promotion/demotion is not allowed");
        const newRole = currentRole === "Admin" ? "User" : "Admin";
        if (!window.confirm(`Change ${newRole === "Admin" ? "to Admin" : "to User"}?`)) return;

        try {
            setUpdatingUserId(userId);
            await updateUserRole(userId, newRole);
            toast.success(`Role updated to ${newRole}`);
            const data = await getAllUsers();
            dispatch(setAllUsers(data.users));
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setUpdatingUserId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

            <div className="flex items-center gap-3 mb-8">
                <div className="bg-secondary/10 p-2.5 rounded-xl">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">User Management</h1>
                    <p className="text-gray-500 text-xs md:text-sm">Manage system access and roles</p>
                </div>
            </div>

            {loading && !allUsers.length ? (
                <div className="flex flex-col justify-center items-center h-64 gap-4">
                    <Loader className="w-10 h-10 animate-spin text-secondary" />
                    <p className="text-gray-400 font-medium animate-pulse text-sm">Fetching user directory...</p>
                </div>
            ) : (
                <>
                    <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-widest font-bold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Identity</th>
                                    <th className="px-6 py-4">Email Address</th>
                                    <th className="px-6 py-4">Current Role</th>
                                    <th className="px-6 py-4">Join Date</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {allUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.photo.startsWith('http') ? user.photo : `${import.meta.env.VITE_API_URL}/${user.photo}`}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                                />
                                                <span className="font-bold text-gray-800 text-sm">{user.name}</span>
                                                {user._id === currentUser._id && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-bold ml-1">YOU</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm font-medium">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleRoleChange(user._id, user.role)}
                                                disabled={updatingUserId === user._id || user._id === currentUser._id}
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${user._id === currentUser._id ? "text-gray-300" :
                                                    user.role === "Admin" ? "text-red-500 hover:bg-red-50" : "text-green-600 hover:bg-green-50"
                                                    } disabled:opacity-50`}
                                            >
                                                {updatingUserId === user._id ? <Loader className="w-4 h-4 animate-spin" /> : <UserCog className="w-4 h-4" />}
                                                {user.role === "Admin" ? "Demote" : "Promote"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {allUsers.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                onRoleChange={handleRoleChange}
                                isUpdating={updatingUserId === user._id}
                                isCurrentUser={user._id === currentUser._id}
                            />
                        ))}
                    </div>

                    {allUsers.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No users found in the system.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ManageUsers;