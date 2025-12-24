"use client";

import { ProductCard } from "@/components/features/products/product-card";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { useGetProductsQuery } from "@/lib/store/services/products-api";
import { ProductCardSkeleton } from "@/components/features/products/product-card-skelton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAppSelector } from "@/lib/store/hooks";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("All");
  const [pageNo, setPageNo] = useState<number>(1);
  const searchParams = useAppSelector((state) => state.app.searchQuery);

  const { data: products, isFetching: isLoading } = useGetProductsQuery({
    paging: {
      pageNo,
      pageSize: 6,
    },
    filters: searchParams
      ? [
          {
            query_attribute: "product_name",
            query: searchParams || "",
          },
        ]
      : [],
  });

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(products?.data.entities.map((p) => p.product_category) || [])
    );
    return ["All", ...cats];
  }, [products?.data.entities]);

  const filteredProducts = useMemo(() => {
    let filtered = products?.data.entities || [];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (p) => p.product_category === selectedCategory
      );
    }

    return filtered;
  }, [products?.data.entities, selectedCategory]);

  const totalPages = products?.data.entities.length || 1;

  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);

      if (pageNo > 3) {
        items.push("ellipsis-start");
      }

      const start = Math.max(2, pageNo - 1);
      const end = Math.min(totalPages - 1, pageNo + 1);

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (pageNo < totalPages - 2) {
        items.push("ellipsis-end");
      }

      items.push(totalPages);
    }

    return items;
  };

  const paginationItems = generatePaginationItems();

  const handlePreviousPage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (pageNo < totalPages) {
      setPageNo(pageNo + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageChange = (page: number) => {
    setPageNo(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">All Products</h1>
        <p className="text-gray-600">
          Discover our wide range of quality products
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-8 space-y-6">
        {/* Category Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-lg">Categories</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category);
                  setPageNo(1);
                }}
                className="transition-all duration-200"
              >
                {category.replace(/_/g, " ")}
                {selectedCategory === category && (
                  <Badge className="ml-2 bg-white text-primary hover:bg-white">
                    {category === "All"
                      ? products?.data.entities.length
                      : products?.data.entities.filter(
                          (p) => p.product_category === category
                        ).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters & Results Count */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of{" "}
            {products?.data.entities.length} products
          </p>
          {(selectedCategory !== "All" || priceRange !== "All") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory("All");
                setPriceRange("All");
                setPageNo(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Product Grid - 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCardSkeleton isLoading={isLoading} />
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State - if no products */}
      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-2">No products found</p>
          <p className="text-gray-500 text-sm mb-4">
            Try adjusting your filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory("All");
              setPriceRange("All");
              setPageNo(1);
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && !isLoading && (
        <div className="flex justify-center mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  className={`${
                    pageNo === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }`}
                />
              </PaginationItem>

              {paginationItems.map((item, index) => {
                if (item === "ellipsis-start" || item === "ellipsis-end") {
                  return (
                    <PaginationItem key={`${item}-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={item}>
                    <PaginationLink
                      onClick={() => handlePageChange(item as number)}
                      isActive={pageNo === item}
                      className="cursor-pointer"
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  className={`${
                    pageNo === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
