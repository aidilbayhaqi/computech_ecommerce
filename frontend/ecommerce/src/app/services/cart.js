import axiosInstance from "./axiosController";
const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllCart = async () => {
  try {
    const response = await axiosInstance.get(`${backend}/cart`);
    return response.data;
  } catch (error) {
    console.error("Failed fetching cart:", error);
  }
};

export const postCart = async (product_id, quantity = 1) => {
  try {
    const response = await axiosInstance.post(`${backend}/cart`,{
        product_id,
        quantity
    });
    return response.data;
  } catch (error) {
    console.error("Failed fetching cart:", error);
  }
};


export const deleteCartItem = async (itemId) => {
    try {
      const response = await axiosInstance.delete(`${backend}/cart/${itemId}`);
      return response.data;
    } catch (error) {
      console.error("Failed removing item from cart:", error);
      throw error;
    }
  };
  

  export const decreaseCartItem = async (product_id) => {
    try {
      const response = await axiosInstance.post(`${backend}/cart/decrease`, {
        product_id,
      });
      return response.data;
    } catch (error) {
      console.error("Failed decreasing item:", error);
      throw error;
    }
  };