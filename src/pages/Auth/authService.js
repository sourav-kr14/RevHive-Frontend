import api from "../../services/api";

export const loginUser = async (data) => {
  try {
    console.log("Making login request to /auth/login with:", { userNameOrEmail: data.userNameOrEmail });
    const res = await api.post("/auth/login", data);
    console.log("Login response received:", res.data);

    if (!res.data || !res.data.token) {
      throw new Error("Invalid response: missing token");
    }

    return res.data;
  } catch (error) {
    console.error("loginUser error:", error);
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    console.log("Making register request to /auth/register");
    const res = await api.post("/auth/register", data);
    console.log("Register response received:", res.data);

    return res.data;
  } catch (error) {
    console.error("registerUser error:", error);
    throw error;
  }
};
