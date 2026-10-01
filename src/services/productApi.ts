import apiClient from './apiClient';

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
  const response = await apiClient.get<Product[]>('/products?limit=12');
  return response.data;
};

export const fetchProductById = async (id: number | string): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

export default {
  fetchProducts,
  fetchProductById,
};
