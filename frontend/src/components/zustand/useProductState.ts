import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { UploadFile } from "antd/es/upload/interface";
import axios from "axios";

export interface ProductData {
  key: string;
  name: string;
  status: "active" | "inactive";
  image: string | UploadFile[];
  description?: string;
  category?: string;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  thumbnail?: string;
}

interface ApiResponse {
  products: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    thumbnail: string;
  }>;
  total: number;
  skip: number;
  limit: number;
}

export interface ProductState {
  products: ProductData[];
  product: ProductData | null;
  currentFeature: "create" | "update" | "delete" | "view" | null;
  isLoading: boolean;
  error: string | null;
  setProducts: (products: ProductData[]) => void;
  fetchProducts: () => Promise<void>;
  addProduct: () => void;
  updateProduct: () => void;
  deleteProduct: () => void;
}

export const useProductState = create<ProductState>((set) => ({
  products: [],
  product: null,
  currentFeature: null,
  isLoading: false,
  error: null,
  setProducts: (products) => set({ products }),
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<ApiResponse>(
        "https://dummyjson.com/products"
      );
      const formattedProducts = response.data.products.map((item) => ({
        key: item.id.toString(),
        name: item.title,
        status: item.stock > 0 ? ("active" as const) : ("inactive" as const),
        image: item.thumbnail,
        description: item.description,
        category: item.category,
        price: item.price,
        discountPercentage: item.discountPercentage,
        rating: item.rating,
        stock: item.stock,
        brand: item.brand,
      }));
      set({ products: formattedProducts, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },
  addProduct: () =>
    set((state) => {
      if (!state.product) return state;
      const newProduct: ProductData = {
        ...state.product,
        key: uuidv4(),
        image: `https://picsum.photos/${Math.floor(Math.random() * 1000)}`,
      };
      return {
        products: [...state.products, newProduct],
      };
    }),
  updateProduct: () =>
    set((state) => {
      if (!state.product) return state;
      const updatedProducts: ProductData[] = state.products.map((p) =>
        p.key === state.product?.key ? state.product : p
      ) as ProductData[];
      return {
        products: [...updatedProducts],
      };
    }),
  deleteProduct: () =>
    set((state) => ({
      products: state.products.filter((p) => p.key !== state.product?.key),
      product: null,
      currentFeature: null,
    })),
}));
