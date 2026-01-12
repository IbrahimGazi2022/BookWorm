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
  MyLibrary
} from "./components/index.js";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/browse"} /> : <Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/dashboard" element={user?.role === "Admin" ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin/genres" element={user?.role === "Admin" ? <ManageGenres /> : <Navigate to="/" />} />
        <Route path="/admin/books" element={user?.role === "Admin" ? <ManageBooks /> : <Navigate to="/" />} />

        {/* --- USER ROUTES --- */}
        <Route path="/my-library" element={user ? <MyLibrary /> : <Navigate to="/" />} />
        <Route path="/browse" element={user ? <BrowseBooks /> : <Navigate to="/" />} />
        <Route path="/books/:id" element={user ? <BookDetails /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;