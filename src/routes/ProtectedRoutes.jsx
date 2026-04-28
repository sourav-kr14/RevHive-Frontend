import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "ADMIN" ? children : <Navigate to="/" />;
};

export const UserRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "USER" ? children : <Navigate to="/" />;
};
