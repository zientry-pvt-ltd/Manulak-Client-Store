export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // Add this for multiple images
  category: string;
  stock: number;
  rating?: number;
}
