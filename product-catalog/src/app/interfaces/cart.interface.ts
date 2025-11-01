export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}