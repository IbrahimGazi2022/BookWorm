import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
  Tutorials,
} from "./components/index.js";
import Layout from "./components/layout/Layout";

const App = () => {
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");
  const isAuthenticated = user && token;

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === "Admin" ? "/admin/dashboard" : "/dashboard"} /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

        {/* ADMIN ROUTES WITH LAYOUT */}
        <Route path="/admin/dashboard" element={isAuthenticated && user?.role === "Admin" ? <Layout><AdminDashboard /></Layout> : <Navigate to="/" />} />
        <Route path="/admin/genres" element={isAuthenticated && user?.role === "Admin" ? <Layout><ManageGenres /></Layout> : <Navigate to="/" />} />
        <Route path="/admin/books" element={isAuthenticated && user?.role === "Admin" ? <Layout><ManageBooks /></Layout> : <Navigate to="/" />} />
        <Route path="/admin/users" element={isAuthenticated && user?.role === "Admin" ? <Layout><ManageUsers /></Layout> : <Navigate to="/" />} />
        <Route path="/admin/reviews" element={isAuthenticated && user?.role === "Admin" ? <Layout><ManageReviews /></Layout> : <Navigate to="/" />} />
        <Route path="/admin/tutorials" element={isAuthenticated && user?.role === "Admin" ? <Layout><ManageTutorials /></Layout> : <Navigate to="/" />} />

        {/* USER ROUTES WITH LAYOUT */}
        <Route path="/dashboard" element={isAuthenticated ? <Layout><UserDashboard /></Layout> : <Navigate to="/" />} />
        <Route path="/my-library" element={isAuthenticated ? <Layout><MyLibrary /></Layout> : <Navigate to="/" />} />
        <Route path="/browse" element={isAuthenticated ? <Layout><BrowseBooks /></Layout> : <Navigate to="/" />} />
        <Route path="/books/:id" element={isAuthenticated ? <Layout><BookDetails /></Layout> : <Navigate to="/" />} />
        <Route path="/tutorials" element={isAuthenticated ? <Layout><Tutorials /></Layout> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;