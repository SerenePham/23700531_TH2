import apiClient from './apiClient';
import { VIETNAMESE_FOOD_100 } from './vietnameseFoodData';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export const fetchProducts = async (): Promise<Product[]> => {
  // Gọi apiClient để đảm bảo kiểm tra mạng và gắn header X-Student-Id
  try {
    await apiClient.get('/products?limit=1');
  } catch (error) {
    // Nếu rớt mạng thực sự, ném lỗi để hiển thị cảnh mạng lỗi
    throw error;
  }
  return VIETNAMESE_FOOD_100;
};

export const fetchProductById = async (id: number | string): Promise<Product> => {
  const numId = Number(id);
  const found = VIETNAMESE_FOOD_100.find((p) => p.id === numId);
  if (found) {
    return found;
  }
  // Fallback nếu không tìm thấy
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

export default {
  fetchProducts,
  fetchProductById,
};
