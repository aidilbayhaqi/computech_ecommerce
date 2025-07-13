import axios from "axios";
import axiosInstance from "./axiosController";
axios.defaults.withCredentials = true;

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

// GET all Payment
export const getAllPayment = async () => {
  try {
    const response = await axiosInstance.get(`${backend}/transaction`);
    return response.data;
  } catch (error) {
    console.error("Failed fetching transaction:", error);
  }
};

// GET single Payment
export const getPaymentById = async (id) => {
  const response = await axiosInstance.get(`/transaction/${id}`);
  return response.data;
};

// ADD new Payment
export const addPayment = async (data) => {
  const response = await axiosInstance.post("/transaction", data);
  return response.data;
};
