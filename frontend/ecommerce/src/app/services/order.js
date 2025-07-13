import axiosInstance from "./axiosController";
const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 Create Order
export const createOrder = async (orderData) => {
  try {
    const res = await axiosInstance.post(`${backend}/order`, orderData);
    return res.data;
  } catch (error) {
    console.error(error.message || "Gagal membuat order");
    throw error;
  }
};

// 🔹 Get Order By ID
export const getOrderById = async (orderId) => {
  try {
    const res = await axiosInstance.get(`${backend}/order/${orderId}`);
    return res.data;
  } catch (error) {
    console.error(error.message || "Gagal membuat order");
    throw error;
  }
};

// 🔹 Update Order Status (e.g. complete, cancelled)
export const updateOrderStatus = async ({ order_id, status_payment }) => {
  try {
    const res = await axiosInstance.patch(`${backend}/order/status`, {
      order_id,
      status_payment,
    });
    return res.data;
  } catch (error) {
    console.error(error.message || "Gagal membuat order");
    throw error;
  }
};

export const getMyOrders = async () => {
  try {
    const res = await axiosInstance.get(`${backend}/order/me`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Gagal mengambil data order user:", err);
    throw err;
  }
};

export const deleteOrder = async (id)=>{
  try {
    const res = await axiosInstance.delete(`${backend}/order/${id}`)
  } catch (error) {
    console.error("gagal menghapus order:", err);
    throw err;
  }
}
