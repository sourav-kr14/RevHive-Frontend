import Signup from "./pages/Auth/Signup";
import Signin from "./pages/Auth/Signin";

import AdminLayout from "./components/admin/layout/AdminLayout";
import AdminDashboard from "./components/admin/dashboard/AdminDashboard";
import AdminUsers from "./components/admin/dashboard/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import { Toaster } from "sonner";
import { AdminRoute, UserRoute } from "./routes/ProtectedRoutes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./components/userdashboard/UserLayout";
import MessagingLayout from "./components/messaging/MessagingLayout";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ProfileLayout from "./user-profile/ProfileLayout";
import DashboardPage from "./components/userdashboard/DashboardPage";
import Premium from "./components/userdashboard/Premium";
import SettingsPage from "./pages/settings/SettingsPage";
import AdminPremium from "./components/admin/dashboard/AdminPremium";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster theme="system" position="bottom-right" richColors />
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
          <Route path="premium" element={<AdminPremium />} />
        </Route>

        <Route path="/messages" element={<MessagingLayout />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile/:userId" element={<ProfileLayout />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/premium" element={<Premium />} />

        {/* <Route index element={<ProfilePosts />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
