type Category = "PLANTS" | "FERTILIZER" | "EQUIPMENTS";
export interface Product {
  id: string;
  product_name: string;
  product_desc: string;
  product_category: Category;
  bought_price: number;
  selling_price: number;
  unit_weight: number;
  quantity: number;
  courier_chargers_1kg: number;
  courier_chargers_more_than_1kg: number;
  product_image_urls: string[];
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
