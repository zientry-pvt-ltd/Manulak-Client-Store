"use client";

import { ProductCard } from "@/components/features/products/product-card";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { useGetProductsQuery } from "@/lib/store/services/products-api";
import { ProductCardSkeleton } from "@/components/features/products/product-card-skelton";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("All");

  const { data: products, isLoading } = useGetProductsQuery();

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
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                {category}
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
        {products?.data.entities.map((product) => (
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
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
