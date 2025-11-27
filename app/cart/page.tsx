"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/lib/store/slices/cart-slice";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { items: storedCartItems, totalAmount } = useAppSelector(
    (state) => state.cart
  );

  const dispatch = useAppDispatch();
  const navigate = useRouter();

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= 99) {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleProceedToCheckout = () => {
    navigate.push("/checkout");
  };

  const handleReturnToShop = () => {
    navigate.push("/products");
  };

  // Calculate totals
  const subtotal = storedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  if (storedCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingCart className="h-24 w-24 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Add some products to your cart to get started!
          </p>
          <Button onClick={handleReturnToShop} size="lg">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">
              {storedCartItems.length}{" "}
              {storedCartItems.length === 1 ? "item" : "items"} in cart
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearDialog(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            {storedCartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border rounded-lg bg-white transition-shadow"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-xl font-bold text-primary mb-3">
                    ${item.price.toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <Input
                      type="number"
                      min="1"
                      max="99"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 h-8 text-center"
                    />

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= 99}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <span className="text-sm text-gray-500 ml-2">
                      = ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Return to Shop Button - Mobile */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleReturnToShop}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-white sticky top-4">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">Rs:{totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `RS:${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {subtotal < 100 && (
                <p className="text-xs text-gray-500 italic">
                  Add Rs:{(100 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">Rs:{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                className="w-full hidden lg:flex"
                onClick={handleReturnToShop}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Shopping Cart?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all items from your cart. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCart}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear Cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
