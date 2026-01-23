import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Your backend URL
  withCredentials: true, // THIS IS MANDATORY for cookies
});

export default api;
