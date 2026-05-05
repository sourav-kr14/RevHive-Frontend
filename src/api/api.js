// import axios from "axios";

// const api = axios.create({ baseURL: "http://localhost:8080/api" });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   console.log(token);

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

// export const getAnalytics = async () => {
//   const token = localStorage.getItem("token");

//   const res = await fetch("http://localhost:8080/api/admin/analytics", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch analytics");

//   return res.json();
// };
