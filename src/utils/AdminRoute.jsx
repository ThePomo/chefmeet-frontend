// src/utils/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.ruolo !== "Admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
