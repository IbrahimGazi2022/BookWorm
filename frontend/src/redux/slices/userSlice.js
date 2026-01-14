import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        stats: null,
        recommendations: [],
        goal: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setDashboardData: (state, action) => {
            state.stats = action.payload.stats;
            state.recommendations = action.payload.recommendations;
        },
        setGoal: (state, action) => {
            state.goal = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.stats = null;
            state.recommendations = [];
            state.goal = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
});

export const { setUser, setDashboardData, setGoal, logout } = userSlice.actions;
export default userSlice.reducer;