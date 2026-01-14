import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import bookReducer from './slices/bookSlice';
import userReducer from './slices/userSlice';
import shelfReducer from './slices/shelfSlice';

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        books: bookReducer,
        user: userReducer,
        shelf: shelfReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, 
        }),
});