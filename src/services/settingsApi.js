const BASE_URL = "http://localhost:8080";

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
    const res = await fetch(`${BASE_URL}/api/users/settings/profile`, {
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
