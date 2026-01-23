import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (token) {
    // Works by modifying what is sent in the request headers slightly
    // (Prevents browser autocomplete faking a request)
    config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

export default api;
