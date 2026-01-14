import { createSlice } from '@reduxjs/toolkit';

const bookSlice = createSlice({
    name: 'books',
    initialState: {
        allBooks: [],
        allGenres: [],
        allTutorials: [],
        currentBook: null
    },
    reducers: {
        setAllBooks: (state, action) => {
            state.allBooks = action.payload;
        },
        setAllGenres: (state, action) => {
            state.allGenres = action.payload;
        },
        setAllTutorials: (state, action) => {
            state.allTutorials = action.payload;
        },
        setBookDetails: (state, action) => {
            state.currentBook = action.payload;
        }
    },
});

export const { setAllBooks, setAllGenres, setAllTutorials, setBookDetails } = bookSlice.actions;
export default bookSlice.reducer;