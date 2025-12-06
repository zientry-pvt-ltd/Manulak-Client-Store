"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { addToCart } from "@/lib/store/slices/cart-slice";
import { addToWishlist } from "@/lib/store/slices/wishlist-slice";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const allImages = [
    product.product_image_urls[0],
    ...(product.product_image_urls.slice(1) || []),
  ].slice(0, 5);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product.id,
        name: product.product_name,
        price: product.selling_price,
        quantity: 1,
        image: product.product_image_urls[0],
      })
    );
    toast.success(`${product.product_name} added to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      addToWishlist({
        id: product.id,
        name: product.product_name,
        price: product.selling_price,
        stock: product.quantity,
        image: product.product_image_urls[0],
      })
    );
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDialog(true);
    setSelectedImageIndex(0);
  };

  return (
    <>
      <div
        className={cn(
          "group relative border rounded-lg overflow-hidden transition-all duration-300 ease-in-out bg-white",
          "hover:border-primary hover:shadow-lg hover:shadow-primary/20",
          isHovered && "border-primary shadow-lg shadow-primary/20"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <Image
            src={product.product_image_urls[0]}
            alt={product.product_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Stock Badge */}
          {product.quantity < 10 && (
            <Badge variant="destructive" className="absolute top-3 left-3 z-10">
              Only {product.quantity} left
            </Badge>
          )}

          {/* Hover Actions - Top Right */}
          <div
            className={cn(
              "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300",
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            )}
          >
            <Button
              size="icon"
              variant={isInWishlist ? "default" : "secondary"}
              className={cn(
                "h-10 w-10 rounded-full shadow-md",
                isInWishlist && "bg-red-500 hover:bg-red-600"
              )}
              onClick={handleToggleWishlist}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isInWishlist && "fill-current text-white"
                )}
              />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full shadow-md"
              onClick={handleViewDetails}
            >
              <Eye className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col">
          <h3 className="font-semibold text-lg line-clamp-2">
            {product.product_name}
          </h3>

          {/* description */}
          {product.product_desc && (
            <span className="text-sm font-medium h-20 line-clamp-3">
              {product.product_desc}
            </span>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mt-2 mb-4">
            <p className="text-2xl font-bold text-primary">
              Rs:{product.selling_price.toFixed(2)}
            </p>
            <span className="text-sm text-gray-500">
              {product.product_category}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={product.quantity === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Product Details Dialog with Image Gallery */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="lg:max-w-4xl md:max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="px-4 pt-3 gap-0">
            <DialogTitle className="text-2xl">
              {product.product_name}
            </DialogTitle>
            <DialogDescription>{product.product_category}</DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[75vh] px-4 pb-6 pt-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex gap-2 flex-row">
              {/* Thumbnail Column - Vertical on the right */}
              {product.product_image_urls.length > 1 && (
                <div className="flex flex-col justify-start gap-2 order-2 lg:order-1">
                  {product.product_image_urls.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200",
                        selectedImageIndex === index
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-gray-200 hover:border-gray-400"
                      )}
                    >
                      <Image
                        src={img}
                        alt={`${product.product_name} view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="relative flex-1 h-96 rounded-lg overflow-hidden bg-gray-100 order-1">
                <Image
                  src={product.product_image_urls[selectedImageIndex]}
                  alt={product.product_name}
                  fill
                  className="object-cover transition-opacity duration-300"
                  priority
                />
                {/* Image Counter Badge */}
                {allImages.length > 1 && (
                  <Badge className="absolute bottom-3 right-3 bg-black/60 text-white">
                    {selectedImageIndex + 1} / {allImages.length}
                  </Badge>
                )}
              </div>
            </div>
            {/* Details Section */}
            <div className="space-y-4 flex flex-col">
              <p className="text-2xl font-bold text-primary">
                Rs:{product.selling_price.toFixed(2)}
              </p>

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600">{product.product_desc}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Availability</h4>
                <p className="text-gray-600">
                  {product.quantity > 0 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                      In Stock ({product.quantity} available)
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                      Out of Stock
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-3 mt-auto">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  disabled={product.quantity === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant={isInWishlist ? "default" : "outline"}
                  size="icon"
                  onClick={handleToggleWishlist}
                  className={isInWishlist ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      isInWishlist && "fill-current text-white"
                    )}
                  />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
