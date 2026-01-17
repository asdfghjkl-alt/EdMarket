import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3314", // Your backend URL
  withCredentials: true, // THIS IS MANDATORY for cookies
});

export default api;
