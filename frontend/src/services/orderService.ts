import axios from "axios";

export interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Order {
  id: number;
  products: Product[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface OrderResponse {
  carts: Order[];
  total: number;
  skip: number;
  limit: number;
}

const orderService = {
  getOrders: async () => {
    const response = await axios.get<OrderResponse>(
      "https://dummyjson.com/carts"
    );
    return response.data;
  },
};

export default orderService;
