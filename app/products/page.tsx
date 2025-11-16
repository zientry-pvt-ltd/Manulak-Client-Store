"use client";

import { ProductCard } from "@/components/features/products/product-card";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { Product } from "@/types/product";
// Mock data - Replace with actual API call
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium noise-cancelling headphones with 30-hour battery life and crystal clear sound quality.",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop",
    ],
    category: "Audio",
    stock: 25,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    description:
      "Advanced fitness tracking, heart rate monitoring, and smartphone notifications on your wrist.",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Wearables",
    stock: 15,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Mechanical Gaming Keyboard",
    description:
      "RGB backlit mechanical keyboard with customizable keys and lightning-fast response time.",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 50,
    rating: 4.6,
  },
  {
    id: "4",
    name: "4K Ultra HD Camera",
    description:
      "Professional-grade camera with 4K video recording and advanced image stabilization.",
    price: 899.99,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 8,
    rating: 4.9,
  },
  {
    id: "5",
    name: "Portable Speaker",
    description:
      "Waterproof Bluetooth speaker with 360-degree sound and 12-hour battery life.",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    category: "Audio",
    stock: 100,
    rating: 4.3,
  },
  {
    id: "6",
    name: "Laptop Stand Aluminum",
    description:
      "Ergonomic laptop stand with adjustable height and cooling ventilation design.",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
    category: "Accessories",
    stock: 75,
    rating: 4.4,
  },
  {
    id: "7",
    name: "Wireless Mouse",
    description:
      "Precision wireless mouse with ergonomic design and long-lasting battery.",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 0,
    rating: 4.2,
  },
  {
    id: "8",
    name: "USB-C Hub Adapter",
    description:
      "Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader for laptops.",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop",
    category: "Accessories",
    stock: 120,
    rating: 4.7,
  },
  {
    id: "9",
    name: "Smartphone Gimbal Stabilizer",
    description:
      "3-axis gimbal stabilizer for smooth video recording with your smartphone.",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 30,
    rating: 4.6,
  },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("All");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)));
    return ["All", ...cats];
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = MOCK_PRODUCTS;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    return filtered;
  }, [selectedCategory]);

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
                      ? MOCK_PRODUCTS.length
                      : MOCK_PRODUCTS.filter((p) => p.category === category)
                          .length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters & Results Count */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {MOCK_PRODUCTS.length} products
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
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State - if no products */}
      {filteredProducts.length === 0 && (
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
