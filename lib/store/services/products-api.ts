import type { Product } from "@/types/product";
import { ApiResourceList } from "@/types/common";
import { api } from "./api";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResourceList<Product>, void>({
      query: () => ({
        url: "/product/get-all-products",
        method: "POST",
        body: {
          paging: { pageNo: 1, pageSize: 100 },
          filters: [],
          sorting: { columnName: "created_at", order: -1 },
        },
      }),
    }),
    getProductById: builder.query<Product, string>({
      query: (productId) => ({
        url: `/product/get-product/${productId}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
