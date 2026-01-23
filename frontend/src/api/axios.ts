import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Your backend URL
  withCredentials: true, // THIS IS MANDATORY for cookies
});

let csrfToken: string | null = null;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

api.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

export default api;
