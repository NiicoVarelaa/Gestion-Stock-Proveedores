export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  minStock: number;
  supplierId: string;
  supplier: Supplier;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string | null;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
