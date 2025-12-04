"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Heart, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { removeFromWishlist } from "@/lib/store/slices/wishlist-slice";
import { addToCart } from "@/lib/store/slices/cart-slice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const { items: storedWishlistItems } = useAppSelector(
    (state) => state.wishlist
  );

  const handleAddToCart = (item: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  }) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      })
    );
    toast.success(`${item.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    dispatch(removeFromWishlist(itemId));
  };

  if (storedWishlistItems.length === 0) {
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
          <Button onClick={() => navigate.push("/products")}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
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
          {storedWishlistItems.length}{" "}
          {storedWishlistItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {storedWishlistItems.map((item) => (
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
