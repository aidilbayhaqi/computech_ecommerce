import axiosInstance from "./axiosController";
const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllOrder = async () => {
    try {
      const res = await axiosInstance.get(`${backend}/order`);
      return res.data.data;
    } catch (error) {
      console.error("Failed fetching products:", error);
      return [];
    }
};