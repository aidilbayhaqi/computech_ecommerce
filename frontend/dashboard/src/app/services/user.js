import axios from "axios";
import axiosInstance from './axiosController'
axios.defaults.withCredentials = true;

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

// GET all user
export const getAllUser = async () => {
  try {
    const response = await axiosInstance.get(`${backend}/user`);
    return response.data;
  } catch (error) {
    console.error("Failed fetching users:", error);
  }
};

// GET single user
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`${backend}/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed fetching users:", error);
  }

};

// UPDATE user
export const updateUsers = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${backend}/user/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Jika pakai cookie auth
    });
    return response.data;
  } catch (error) {
    console.error("Failed fetching Userss:", error);
    return [];
  }
}

// DELETE user
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`${backend}/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('failed delete user:', error)
  }
 
};
