import Signup from "./pages/Auth/Signup";
import Signin from "./pages/Auth/Signin";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";

import { AdminRoute, UserRoute } from "./routes/ProtectedRoutes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SettingsLayout from "./components/settings/SettingsLayout";
import UserLayout from "./components/userdashboard/UserLayout";
import MessagingLayout from "./components/messaging/MessagingLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />

          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* USER */}
        <Route
          path="/user/dashboard"
          element={
            <UserRoute>
              <UserLayout />
            </UserRoute>
          }
        />

        <Route path="/messages" element={<MessagingLayout />} />
        <Route path="/settings" element={<SettingsLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
