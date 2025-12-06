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
import { useEffect, useState } from "react";
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
import { useCalculateOrderValueMutation } from "@/lib/store/services/orders-api";
import { useLazyGetProductByIdQuery } from "@/lib/store/services/products-api";

export default function CartPage() {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [insufficientStockItems, setInsufficientStockItems] = useState<
    string[]
  >([]);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const { items: storedCartItems } = useAppSelector((state) => state.cart);

  const [getProduct, { isLoading: isLoadingProduct }] =
    useLazyGetProductByIdQuery();

  const [calculateOrderValue, { data, error, isLoading }] =
    useCalculateOrderValueMutation();

  const calculationSummary = data?.data;

  const dispatch = useAppDispatch();
  const navigate = useRouter();

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleReturnToShop = () => {
    navigate.push("/products");
  };

  const validateStockBeforeCheckout = async () => {
    const outOfStockItems: string[] = [];

    for (const item of storedCartItems) {
      try {
        const { data: product } = await getProduct(item.id).unwrap();

        if (product.quantity < item.quantity)
          outOfStockItems.push(
            `${item.name} - Only ${product.quantity} available, but ${item.quantity} in cart`
          );
      } catch (err) {
        outOfStockItems.push(
          `${item.name} - Product not found. It may have been removed.`
        );
        console.error(`Error fetching product ${item.id}:`, err);
      }
    }

    if (outOfStockItems.length > 0) {
      setInsufficientStockItems(outOfStockItems);
      setShowStockDialog(true);
      return false;
    }

    return true;
  };

  const handleProceedToCheckout = async () => {
    const isStockValid = await validateStockBeforeCheckout();
    if (isStockValid) {
      navigate.push("/checkout");
    }
  };

  useEffect(() => {
    if (storedCartItems.length > 0) {
      const orderItemsArray = storedCartItems.map((item) => ({
        product_id: item.id,
        required_quantity: item.quantity,
      }));

      calculateOrderValue({ orderItemsArray });
    }
  }, [storedCartItems, calculateOrderValue]);

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
            <ShoppingBag className="mr-2 h-4 w-4" />
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
                    Rs:{item.price.toFixed(2)}
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
                      className="w-20 h-8 text-center"
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
                      = Rs:{(item.price * item.quantity).toFixed(2)}
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
          <div className="border rounded-lg p-6 bg-white sticky top-4 min-h-[330px] flex flex-col justify-between">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {error && (
              <span>Problem calculating order value. Please try again.</span>
            )}

            {isLoading && <span>Calculating order value...</span>}

            {calculationSummary && (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    Rs:{calculationSummary.itemsValue.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {calculationSummary.courierValue === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `RS:${calculationSummary.courierValue.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      Rs:{calculationSummary.totalValue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleProceedToCheckout}
                disabled={isLoadingProduct}
              >
                {isLoadingProduct ? "Checking Stock..." : "Proceed to Checkout"}
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

      {/* Insufficient Stock Dialog */}
      <AlertDialog open={showStockDialog} onOpenChange={setShowStockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stock Unavailable</AlertDialogTitle>
            <AlertDialogDescription>
              Some items in your cart have insufficient stock. We&apos;ve
              adjusted the quantities to what&apos;s available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 max-h-48 overflow-y-auto space-y-2">
            {insufficientStockItems.map((item, index) => (
              <div
                key={index}
                className="text-sm text-red-600 p-2 bg-red-50 rounded"
              >
                {item}
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowStockDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
