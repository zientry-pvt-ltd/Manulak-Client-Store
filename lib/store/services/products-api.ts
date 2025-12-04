import type { Product } from "@/types/product";
import { ApiResource, ApiResourceList } from "@/types/common";
import { api } from "./api";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResourceList<Product>, number>({
      query: (pageNo) => ({
        url: "/product/get-all-products",
        method: "POST",
        body: {
          paging: { pageNo: pageNo, pageSize: 6 },
          filters: [],
          sorting: { columnName: "created_at", order: -1 },
        },
      }),
    }),
    getProductById: builder.query<ApiResource<Product>, string>({
      query: (productId) => ({
        url: `/product/get-product-by-id/${productId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
} = productsApi;
