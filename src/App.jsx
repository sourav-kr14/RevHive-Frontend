import Signup from "./pages/Auth/Signup";
import Signin from "./pages/Auth/Signin";

import AdminLayout from "./components/admin/layout/AdminLayout";
import AdminDashboard from "./components/admin/dashboard/AdminDashboard";
import AdminUsers from "./components/admin/dashboard/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import { Toaster } from "sonner";
import { AdminRoute, UserRoute } from "./routes/ProtectedRoutes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SettingsLayout from "./components/settings/SettingsLayout";
import UserLayout from "./components/userdashboard/UserLayout";
import MessagingLayout from "./components/messaging/MessagingLayout";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster theme="system" position="top-right" richColors />
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
