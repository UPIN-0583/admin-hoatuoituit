// api.js
import axios from "axios";

const BASE_URL = "https://backendhoatuoiuit.onrender.com";

const instance = axios.create({
  baseURL: BASE_URL,
});

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
