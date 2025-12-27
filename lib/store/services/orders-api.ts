import {
  CalculateOrderValueRequest,
  CalculateOrderValueResponse,
  OnlineManualOrder,
  Order,
  OrderCreateResponse,
} from "@/types/orders";
import { api } from "./api";
import { ApiResource } from "@/types/common";

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrderStatus: builder.query<
      ApiResource<Order>,
      { orderId: string; phoneNumber: string }
    >({
      query: ({ orderId, phoneNumber }) => ({
        url: "store/order-status",
        method: "GET",
        params: { phoneNumber, orderId },
      }),
    }),

    createOrder: builder.mutation<OrderCreateResponse, OnlineManualOrder>({
      query: (body) => {
        return {
          url: "/order/create-order",
          method: "POST",
          body,
        };
      },
    }),

    uploadPaymentSlip: builder.mutation<void, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("payment-slip", file);
        return {
          url: `/order/upload-payment-slip/${id}`,
          method: "PUT",
          body: formData,
        };
      },
    }),

    calculateOrderValue: builder.mutation<
      CalculateOrderValueResponse,
      CalculateOrderValueRequest
    >({
      query: (orderData) => ({
        url: "/order/calculate-order-value",
        method: "POST",
        body: orderData,
      }),
    }),
  }),
});

export const {
  useCalculateOrderValueMutation,
  useCreateOrderMutation,
  useUploadPaymentSlipMutation,
  useLazyGetOrderStatusQuery,
} = ordersApi;
