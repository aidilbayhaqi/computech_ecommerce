import axiosInstance from "./axiosController";
const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 Create shipping
export const createShipping = async (shipData) => {
  try {
    const res = await axiosInstance.post(`${backend}/shipping`, shipData);
    return res.data;
  } catch (error) {
    console.error(error.message || "Gagal membuat shipping");
    throw error;
  }
};

// 🔹 Get Order By ID
export const getShippingByOrder = async (orderId) => {
  try {
    const res = await axiosInstance.get(`${backend}/shipping/${orderId}`);
    return res.data;
  } catch (error) {
    console.error(error.message || "Gagal membuat order");
    throw error;
  }
};

// 🔹 Update Order Status (e.g. complete, cancelled)
export const updateShippingStatus = async ({ order_id, statusData }) => {
  try {
    const res = await axiosInstance.patch(`${backend}/order/status`, {
      order_id,
      statusData,
    });
    return res.data;
  } catch (error) {
    console.error(error.message || "Gagal membuat order");
    throw error;
  }
};

export const getMyShipping = async () => {
  try {
    const res = await axiosInstance.get(`${backend}/shipping/me`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Gagal mengambil data order user:", err);
    throw err;
  }
};
