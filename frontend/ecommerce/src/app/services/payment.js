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
export const addPayment = async ({ order_id, gross_amount }) => {
  try {
    const response = await axiosInstance.post(`${backend}/transaction`, {
      order_id,
      gross_amount: Number(gross_amount),
    });
    return response.data;
  } catch (error) {
    console.error(error.message)
  }
};

export const getMyPayments = async (userId) => {
  try {
    const res = await axiosInstance.get(`${backend}/payment/${userId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Gagal mengambil data pembayaran:", err);
    throw err;
  }
};