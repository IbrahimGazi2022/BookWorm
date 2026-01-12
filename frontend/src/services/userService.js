import api from "../utils/api";

// GET ALL USERS (ADMIN)
export const getAllUsers = async () => {
    const response = await api.get("/api/auth/users"); //
    return response.data;
};

// UPDATE USER ROLE (ADMIN)
export const updateUserRole = async (userId, role) => {
    const response = await api.put(`/api/auth/users/${userId}/role`, { role }); 
    return response.data;
};