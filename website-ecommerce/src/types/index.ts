export type CartItem = {
  product: Product;
  quantity: number;
};

export interface Category {
  id: number;
  name: string;
  image: string;
  path: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  price?: number | null;
  inStock: boolean;
}

export interface ProductImage {
  id?: number;
  url: string;
  productId?: number;
}

export interface Icon {
  id: number;
  name: string;
  url: string; 
}

export interface Product {
  id: number;
  name: string;
  price: number;
  images: ProductImage[];
  description: string;
  isNew: boolean;
  inStock: boolean;
  deliveryCost: number;
  articlenr: string;
  variants?: ProductVariant[];
  traits: string;
  categoryId: number;
  iconIds?: number[];
}

export interface OrderItem {
  variant?: ProductVariant | null;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  vatNumber?: string;
  postalCode: string;
  city: string;
  phone: string;
  country: string;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  orderItems: OrderItem[];
  shippingAddress: string; 
}