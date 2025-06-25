import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

const API = axios.create({
  baseURL: API_BASE, // koristi iz .env
});

// Ako imamo token, šaljemo ga automatski
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
