// lib/store/services/productsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product } from "@/types/product";
import { ApiResourceList } from "@/types/common";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL, // relative to Next.js API routes
  }),
  tagTypes: ["Products"],
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
      providesTags: ["Products"],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
