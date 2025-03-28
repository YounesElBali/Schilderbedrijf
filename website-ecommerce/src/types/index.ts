export type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
    isNew?: boolean;
  };
  
  export type CartItem = {
    product: Product;
    quantity: number;
  };