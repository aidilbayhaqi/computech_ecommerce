import axios from "axios";

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: backend, // ganti sesuai URL backend kamu
  withCredentials: true, // jika menggunakan cookie untuk auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
