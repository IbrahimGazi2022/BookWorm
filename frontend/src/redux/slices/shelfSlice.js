import { createSlice } from '@reduxjs/toolkit';

const shelfSlice = createSlice({
    name: 'shelf',
    initialState: {
        shelves: [],
        loading: false,
    },
    reducers: {
        setShelves: (state, action) => {
            state.shelves = action.payload;
        },
        updateBookProgress: (state, action) => {
            const { shelfId, pagesRead, totalPages } = action.payload;
            const bookIndex = state.shelves.findIndex(s => s._id === shelfId);
            if (bookIndex !== -1) {
                state.shelves[bookIndex].pagesRead = pagesRead;
                state.shelves[bookIndex].totalPages = totalPages;
            }
        },
        removeFromReduxShelf: (state, action) => {
            state.shelves = state.shelves.filter(s => s._id !== action.payload);
        }
    },
});

export const { setShelves, updateBookProgress, removeFromReduxShelf } = shelfSlice.actions;
export default shelfSlice.reducer;