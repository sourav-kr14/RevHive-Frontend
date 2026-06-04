const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

const getToken = () => {
  return localStorage.getItem("token");
};

export const settingsAPI = {
  async getCurrentUser() {
    const res = await fetch(`${BASE_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${BASE_URL}/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  async changePassword(data) {
    const res = await fetch(`${BASE_URL}/api/users/settings/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },
};
