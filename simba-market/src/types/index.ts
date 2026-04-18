export interface Product {
  id: string;
  name: string;
  nameKin: string;
  nameFr: string;
  description: string;
  descriptionKin: string;
  descriptionFr: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  badge?: "new" | "sale" | "trending" | "organic";
  inStock: boolean;
  rating: number;
  reviews: number;
  weight?: string;
  brand?: string;
  tags: string[];
}

export type Category =
  | "fruits"
  | "vegetables"
  | "beverages"
  | "snacks"
  | "household"
  | "dairy"
  | "meat"
  | "bakery";

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  delivery: DeliveryInfo;
  payment: PaymentInfo;
  status: "pending" | "confirmed" | "delivered";
  createdAt: string;
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
}

export interface PaymentInfo {
  method: "momo" | "card" | "cash";
  momoNumber?: string;
  status: "pending" | "completed";
}

export type Language = "en" | "fr" | "kin";

export type Theme = "light" | "dark";
