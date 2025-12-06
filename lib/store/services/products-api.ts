import type { Product } from "@/types/product";
import { ApiResource, ApiResourceList } from "@/types/common";
import { api } from "./api";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      ApiResourceList<Product>,
      {
        paging: {
          pageNo: number;
          pageSize: number;
        };
        filters: {
          query_attribute: string;
          query: string;
        }[];
      }
    >({
      query: ({ paging, filters }) => ({
        url: "/product/get-all-products",
        method: "POST",
        body: {
          paging: paging,
          filters: filters,
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
  useLazyGetProductsQuery
} = productsApi;
