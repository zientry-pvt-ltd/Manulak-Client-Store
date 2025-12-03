"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAYMENT_METHOD_OPTIONS } from "@/lib/constants/orders";
import { useLazyGetOrderStatusQuery } from "@/lib/store/services/orders-api";
import { Order } from "@/types/orders";
import { useState } from "react";

const orderSteps = [
  {
    id: 1,
    name: "Pending",
    status: "PENDING",
    description: "Your order is being processed",
  },
  {
    id: 2,
    name: "Confirmed",
    status: "CONFIRMED",
    description: "Your order has been confirmed",
  },
  {
    id: 3,
    name: "Shipped",
    status: "SHIPPED",
    description: "Your order is on the way",
  },
  {
    id: 4,
    name: "Delivered",
    status: "DELIVERED",
    description: "Order has been delivered",
  },
];

export default function OrderStatusTracker() {
  const [getOrderStatus] = useLazyGetOrderStatusQuery();

  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckStatus = async () => {
    if (!orderId.trim() || !phone.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setOrderData(null);

    try {
      const result = await getOrderStatus({
        orderId,
        phoneNumber: phone,
      }).unwrap();

      console.log(result);

      setOrderData(result.data);
    } catch (err) {
      setError(
        (typeof err === "object" &&
          err !== null &&
          "data" in err &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).data?.message) ||
          "An error occurred while fetching order status."
      );
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!orderData) return -1;
    return Math.max(
      0,
      orderSteps.findIndex((step) => step.status === orderData.status)
    );
  };

  const currentStepIndex = getCurrentStepIndex();
  const isCancelled = orderData?.status === "CANCELLED";

  return (
    <div className="container mx-auto px-4 py-8">
      {!orderData && (
        <div className="mb-8 max-w-lg mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-2 text-center">
              Track Your Order
            </h1>
            <p className="text-gray-600 text-center text-sm mb-6">
              Enter your Order ID and phone number to check your order status
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID
                </label>
                <Input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., 31360bab-5bb0-416c-9d07-2301cfce17ca"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., 0771122345"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <Button
                onClick={handleCheckStatus}
                disabled={loading}
                className="w-full mt-6"
              >
                {loading ? "Checking..." : "Check Order Status"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {orderData && (
        <>
          <div className="mb-6">
            <button
              onClick={() => {
                setOrderData(null);
                setOrderId("");
                setPhone("");
                setError("");
              }}
              className="font-medium mb-4"
            >
              ← Back to Search
            </button>

            <h1 className="text-3xl font-bold mb-2">Order Status</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <p className="text-gray-600">
                Order ID:{" "}
                <span className="font-semibold text-gray-900">
                  {orderData.order_id}
                </span>
              </p>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-sm w-fit">
                📅 {new Date(orderData.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Order Status Stepper */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Tracking Status</h2>

            {isCancelled ? (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-700 font-medium">
                  This order has been cancelled
                </p>
                {orderData.admin_message && (
                  <p className="text-red-600 text-sm mt-2">
                    {orderData.admin_message}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{
                          width: `${
                            (currentStepIndex / (orderSteps.length - 1)) * 100
                          }%`,
                        }}
                      />
                    </div>

                    <div className="relative flex justify-between">
                      {orderSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                          <div
                            key={step.id}
                            className="flex flex-col items-center flex-1"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors font-bold text-sm ${
                                isCompleted
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 text-gray-400"
                              } ${isCurrent ? "ring-4 ring-green-200" : ""}`}
                            >
                              {index + 1}
                            </div>
                            <p
                              className={`text-sm font-medium mb-1 text-center ${
                                isCompleted ? "text-gray-900" : "text-gray-500"
                              }`}
                            >
                              {step.name}
                            </p>
                            <p className="text-xs text-gray-500 text-center max-w-[120px]">
                              {step.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="md:hidden space-y-4">
                  {orderSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors font-bold text-sm ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-400"
                            } ${isCurrent ? "ring-4 ring-green-200" : ""}`}
                          >
                            {index + 1}
                          </div>
                          {index < orderSteps.length - 1 && (
                            <div
                              className={`w-0.5 h-16 mt-2 ${
                                isCompleted ? "bg-green-500" : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <p
                            className={`font-medium mb-1 ${
                              isCompleted ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {step.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Value</span>
                    <span className="font-medium">
                      Rs {orderData.order_value.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">
                      {PAYMENT_METHOD_OPTIONS.find(
                        (option) => option.value === orderData.payment_method
                      )?.label || orderData.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selling Method</span>
                    <span className="font-medium">
                      {orderData.selling_method.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-3"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">
                      Rs {orderData.order_value.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                  📍 Delivery Address
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {orderData.first_name} {orderData.last_name}
                    </p>
                    {orderData.company_name && (
                      <p className="text-sm text-gray-600">
                        {orderData.company_name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{orderData.address_line_1}</p>
                    {orderData.address_line_2 && (
                      <p>{orderData.address_line_2}</p>
                    )}
                    {orderData.address_line_3 && (
                      <p>{orderData.address_line_3}</p>
                    )}
                    <p>{orderData.postal_code}</p>
                  </div>
                  <div className="border-t border-gray-200 my-3"></div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      📞 {orderData.primary_phone_number}
                    </p>
                    {orderData.alternate_phone_number_1 && (
                      <p className="text-gray-600">
                        📞 {orderData.alternate_phone_number_1}
                      </p>
                    )}
                    {orderData.alternate_phone_number_2 && (
                      <p className="text-gray-600">
                        📞 {orderData.alternate_phone_number_2}
                      </p>
                    )}
                    {orderData.email && (
                      <p className="text-gray-600">✉️ {orderData.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">📋 Order Details</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Order Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        orderData.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : orderData.status === "DELIVERED" ||
                            orderData.status === "COMPLETE"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {orderData.status}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-3"></div>
                  <div>
                    <p className="text-gray-600 mb-1">Order Date</p>
                    <p className="font-medium">
                      {new Date(orderData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Last Updated</p>
                    <p className="font-medium">
                      {new Date(orderData.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-gray-50 rounded-lg shadow-sm p-6">
                <h3 className="font-semibold mb-2">❓ Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about your order, please contact our
                  support team.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">📞 +1 (555) 123-4567</p>
                  <p className="text-gray-700">✉️ support@manulakagro.com</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
