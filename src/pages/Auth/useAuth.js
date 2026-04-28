import { useNavigate } from "react-router-dom";
import { loginUser } from "./authService";

export const useAuth = () => {
  const navigate = useNavigate();

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role == "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  return { login, logout };
};
