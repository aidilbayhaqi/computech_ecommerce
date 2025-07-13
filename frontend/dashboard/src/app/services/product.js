import axios from "axios";
import axiosInstance from "./axiosController";

axios.defaults.withCredentials=true

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

// GET all products
export const getAllProducts = async () => {
    try {
      const res = await axiosInstance.get(`${backend}/product`);
      const data = Array.isArray(res.data.products)
        ? res.data.products
        : Array.isArray(res.data)
        ? res.data
        : [];

      return data;
    } catch (error) {
      console.error("Failed fetching products:", error);
      return [];
    }
};

// GET single product
export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`${backend}/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed fetching products:", error);
    return [];
  }
  
};

// ADD new product
export const addProduct = async (data) => {
  try {
    const response = await axiosInstance.post(`${backend}/product`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Jika pakai cookie auth
    });
    return response.data;
  } catch (error) {
    console.error("Failed fetching products:", error);
    return [];
  }
};

// UPDATE product
export const updateProduct = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${backend}/product/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Jika pakai cookie auth
    });
    return response.data;
  } catch (error) {
    console.error("Failed fetching products:", error);
    return [];
  }
 
};

// DELETE product
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`${backend}/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("failed to delete product", error)
  }
 
};
