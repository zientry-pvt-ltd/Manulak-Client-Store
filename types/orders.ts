import {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  SELLING_METHODS,
} from "@/lib/constants/orders";
import { ApiResource } from "./common";

export type Order = {
  order_id: string;
  selling_method: SellingMethod;
  order_value: number;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  first_name: string;
  last_name: string;
  admin_message: string | null;
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  postal_code: number;
  primary_phone_number: string;
  company_name: string | null;
  email: string | null;
  alternate_phone_number_1: string | null;
  alternate_phone_number_2: string | null;
  status: OrderStatus;
};

export type CalculateOrderValueResponse = ApiResource<{
  itemsValue: number;
  courierValue: number;
  totalValue: number;
}>;

export type CalculateOrderValueRequest = {
  orderItemsArray: Array<{
    product_id: string;
    required_quantity: number;
  }>;
};

export interface OrderMetaData {
  first_name: string;
  last_name: string;
  selling_method: SellingMethod;
  order_value: number;
  address_line_1: string;
  address_line_2?: string;
  address_line_3?: string;
  postal_code: number;
  primary_phone_number: string;
  status: OrderStatus;
}

export interface PaymentData {
  payment_date?: string;
  paid_amount?: number;
  payment_slip_number?: string;
  payment_method?: PaymentMethod;
}

export interface OrderItem {
  product_id: string;
  required_quantity: number;
}

export interface FullOrder {
  orderMetaData: OrderMetaData;
  paymentData?: PaymentData;
  orderItemsData: OrderItem[];
}

export type OrderStatus = keyof typeof ORDER_STATUSES;
export type SellingMethod = keyof typeof SELLING_METHODS;
export type PaymentMethod = keyof typeof PAYMENT_METHODS;
export type OnlineManualOrder = FullOrder;
export type OrderCreateResponse = ApiResource<
  Order & { order_id: string; paymentId: string }
>;
