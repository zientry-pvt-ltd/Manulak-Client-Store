/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";

// Dummy wishlist data
const dummyWishlistItems = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones with Active Noise Cancellation",
    price: 89.99,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Smart Watch Series 5 - Fitness Tracker",
    price: 249.99,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Premium Leather Laptop Bag",
    price: 129.99,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Portable Power Bank 20000mAh",
    price: 45.99,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
  },
  {
    id: "5",
    name: "4K Webcam for Streaming",
    price: 159.99,
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=400&fit=crop",
  },
  {
    id: "6",
    name: "Mechanical Gaming Keyboard RGB",
    price: 119.99,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
  },
  {
    id: "7",
    name: "Wireless Mouse Ergonomic Design",
    price: 39.99,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
  },
  {
    id: "8",
    name: "USB-C Hub 7-in-1 Adapter",
    price: 54.99,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
  },
];

export default function Page() {
  const [wishlistItems, setWishlistItems] = useState(dummyWishlistItems);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const handleAddToCart = (item: any) => {
    setCartItems([...cartItems, { ...item, quantity: 1 }]);
    alert(`${item.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="h-24 w-24 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Start adding products you love to your favorites!
          </p>
          <Button onClick={() => (window.location.href = "/products")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <span className="text-gray-600">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="group relative border rounded-lg overflow-hidden transition-all duration-300 bg-white hover:shadow-lg"
          >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Out of Stock Badge */}
              {item.stock === 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-14">
                {item.name}
              </h3>

              {/* Price */}
              <p className="text-2xl font-bold text-primary mb-4">
                ${item.price.toFixed(2)}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1"
                  disabled={item.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>

                <Button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  variant="outline"
                  size="icon"
                  className="hover:bg-red-50 hover:border-red-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
