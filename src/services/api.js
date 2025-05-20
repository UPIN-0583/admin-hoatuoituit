import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const instance = axios.create({
  baseURL: BASE_URL,
});

console.log("👉 BASE_URL dùng:", BASE_URL);

instance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ export mặc định để các file cũ dùng được
export default instance;

// ✅ export thêm BASE_URL nếu cần dùng ở các file khác (như BlogPreview)
export { BASE_URL };
