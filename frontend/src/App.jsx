import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {
  Login,
  Register,
  ManageGenres,
  ManageBooks,
  AdminDashboard,
  BrowseBooks,
  BookDetails,
  MyLibrary,
  ManageUsers,
  ManageReviews,
  ManageTutorials,
  UserDashboard,
} from "./components/index.js";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const isAuthenticated = user && token;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/dashboard"} /> : <Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/dashboard" element={isAuthenticated && user?.role === "Admin" ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin/genres" element={isAuthenticated && user?.role === "Admin" ? <ManageGenres /> : <Navigate to="/" />} />
        <Route path="/admin/books" element={isAuthenticated && user?.role === "Admin" ? <ManageBooks /> : <Navigate to="/" />} />
        <Route path="/admin/users" element={isAuthenticated && user?.role === "Admin" ? <ManageUsers /> : <Navigate to="/" />} />
        <Route path="/admin/reviews" element={isAuthenticated && user?.role === "Admin" ? <ManageReviews /> : <Navigate to="/" />} />
        <Route path="/admin/tutorials" element={isAuthenticated && user?.role === "Admin" ? <ManageTutorials /> : <Navigate to="/" />} />

        {/* --- USER ROUTES --- */}
        <Route path="/dashboard" element={isAuthenticated && user?.role !== "Admin" ? <UserDashboard /> : <Navigate to="/" />} />
        <Route path="/my-library" element={isAuthenticated ? <MyLibrary /> : <Navigate to="/" />} />
        <Route path="/browse" element={isAuthenticated ? <BrowseBooks /> : <Navigate to="/" />} />
        <Route path="/books/:id" element={isAuthenticated ? <BookDetails /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;