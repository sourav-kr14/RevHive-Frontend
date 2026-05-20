// src/api/auth.js
import axios from "axios";

const BASE_URL = "http://localhost:8081/api/auth";

export const forgotPassword = (email) =>
  axios.post(`${BASE_URL}/forgot-password?email=${email}`);

export const resetPassword = (token, newPassword) =>
  axios.post(
    `${BASE_URL}/reset-password?token=${token}&newPassword=${newPassword}`,
  );
