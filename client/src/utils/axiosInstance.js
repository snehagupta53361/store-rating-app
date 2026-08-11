import axios from "axios";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// response interceptor

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const json = error.response.data || {};
      let errMsg = json.message || `Error! status: ${error.response.status}`;
      if (json.errors && json.errors.length > 0) {
        const fieldErrors = json.errors
          .map((e) => `${e.path || e.field || "field"}: ${e.msg || e.message}`)
          .join(", ");
        errMsg = `${json.message} (${fieldErrors})`;
      }
      return Promise.reject(new Error(errMsg));
    }
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timeout. Please try again."));
    }
    return Promise.reject(new Error("Invalid server response"));
  },
);

export default axiosInstance;
