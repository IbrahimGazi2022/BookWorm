import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        adminStats: null,
        booksPerGenre: [],
        pendingReviews: [],
        allUsers: [],
    },
    reducers: {
        setAdminData: (state, action) => {
            state.adminStats = action.payload.stats;
            state.booksPerGenre = action.payload.genres;
        },
        setPendingReviews: (state, action) => {
            state.pendingReviews = action.payload;
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },
    },
});

export const { setAdminData, setPendingReviews, setAllUsers } = adminSlice.actions;
export default adminSlice.reducer;