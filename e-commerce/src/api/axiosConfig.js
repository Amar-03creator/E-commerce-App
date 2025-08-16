// src/api/axiosConfig.js
import axios from 'axios';
// Create a new axios instance
const apiClient = axios.create({
  // Set the base URL from the environment variable we will create in Vercel
  baseURL: import.meta.env.VITE_API_URL,

  // Automatically send cookies with every request
  withCredentials: true,
});

export default apiClient;