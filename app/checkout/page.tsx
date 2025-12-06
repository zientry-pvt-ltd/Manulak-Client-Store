/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { CreditCard, Truck, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  useCalculateOrderValueMutation,
  useCreateOrderMutation,
  useUploadPaymentSlipMutation,
} from "@/lib/store/services/orders-api";
import { useAppSelector } from "@/lib/store/hooks";
import z from "zod";
import { onlineManualOrderSchema } from "@/lib/schema.orders";
import { PAYMENT_METHOD_OPTIONS } from "@/lib/constants/orders";
import { PaymentMethod } from "@/types/orders";
import { toast } from "sonner";
import BankDetails from "@/components/features/checkout/bank-details";

export type FormFieldValues = z.infer<typeof onlineManualOrderSchema>;

export default function CheckoutPage() {
  const { items: storedCartItems } = useAppSelector((state) => state.cart);

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [uploadPaymentSlip, { isLoading: isUploadingPaymentSlip }] =
    useUploadPaymentSlipMutation();
  const [calculateOrderValue, { data, error, isLoading }] =
    useCalculateOrderValueMutation();

  const calculationSummary = data?.data;

  const [localSlipFile, setLocalSlipFile] = useState<File | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const validatePhoneMatch = () => {
    const primaryPhone = form.getValues("orderMetaData.primary_phone_number");
    const confirmPhone = form.getValues("orderMetaData.confirm_phone_number");

    if (primaryPhone && !confirmPhone) {
      form.setError("orderMetaData.confirm_phone_number", {
        message: "Please confirm the phone number",
        type: "setValueAs",
      });
      return false;
    }

    if (!confirmPhone) {
      form.clearErrors("orderMetaData.confirm_phone_number");
      return true;
    }

    if (primaryPhone !== confirmPhone) {
      form.setError("orderMetaData.confirm_phone_number", {
        message: "Phone numbers do not match",
        type: "setValueAs",
      });
      return false;
    }

    form.clearErrors("orderMetaData.confirm_phone_number");
    return true;
  };

  const form = useForm<FormFieldValues>({
    resolver: zodResolver(onlineManualOrderSchema),
    mode: "onChange",
    defaultValues: {
      orderMetaData: {
        first_name: "",
        last_name: "",
        selling_method: "ONLINE",
        order_value: 0,
        address_line_1: "",
        address_line_2: "",
        address_line_3: "",
        postal_code: 0,
        primary_phone_number: "",
        confirm_phone_number: "",
        status: "PENDING",
        payment_method: "COD",
      },
      paymentData: undefined,
      orderItemsData: storedCartItems.map((item) => ({
        product_id: item.id,
        required_quantity: item.quantity,
      })),
    },
  });

  const paymentMethod = form.watch("orderMetaData.payment_method");
  const isCOD = paymentMethod === "COD";

  const handlePlaceOrder = async () => {
    setSubmitStatus({ type: null, message: "" });

    // Check if calculation summary is available
    if (calculationSummary == null) {
      const errorMsg =
        "Unable to calculate order value. Please try again later or contact support.";
      setSubmitStatus({ type: "error", message: errorMsg });
      toast.error(errorMsg);
      return;
    }

    // Validate phone numbers match
    if (!validatePhoneMatch()) {
      toast.error("Phone numbers do not match. Please check and try again.");
      return;
    }

    // Trigger form validation
    const isValid = await form.trigger();

    if (!isValid) {
      const errorMsg =
        "Please correct the errors in the form before submitting.";
      setSubmitStatus({ type: "error", message: errorMsg });
      toast.error(errorMsg);

      // Scroll to first error
      const firstError = Object.keys(form.formState.errors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Check if cart is empty
    if (storedCartItems.length === 0) {
      const errorMsg =
        "Your cart is empty. Please add items before placing an order.";
      setSubmitStatus({ type: "error", message: errorMsg });
      toast.error(errorMsg);
      return;
    }

    try {
      const values = form.getValues();
      const { orderItemsData, orderMetaData, paymentData } = values;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirm_phone_number, ...orderMetaDataWithoutConfirm } =
        orderMetaData;

      const updatedOrderMetaData = {
        ...orderMetaDataWithoutConfirm,
        order_value: calculationSummary.totalValue,
      };

      const updatedData = {
        orderMetaData: updatedOrderMetaData,
        orderItemsData: orderItemsData,
        paymentData:
          updatedOrderMetaData.payment_method === "COD"
            ? undefined
            : paymentData,
      };

      // Show processing toast
      toast.loading("Processing your order...", { id: "order-process" });

      // Create the order
      const order = await createOrder(updatedData).unwrap();

      toast.success("Order created successfully!", { id: "order-process" });
      console.log("Order created:", order);

      // Upload payment slip if provided
      if (localSlipFile) {
        toast.loading("Uploading payment slip...", {
          id: "payment-slip-upload",
        });

        try {
          await uploadPaymentSlip({
            id: order.data.paymentId,
            file: localSlipFile,
          }).unwrap();

          toast.success("Payment slip uploaded successfully!", {
            id: "payment-slip-upload",
          });
        } catch (uploadError) {
          console.error("Payment slip upload error:", uploadError);
          toast.error("Failed to upload payment slip, but order was created.", {
            id: "payment-slip-upload",
          });
        }
      }

      // Final success message
      const successMsg =
        "Order placed successfully! You will receive a confirmation shortly.";
      setSubmitStatus({ type: "success", message: successMsg });
      toast.success(successMsg);

      // Reset form after successful submission
      setTimeout(() => {
        form.reset();
        setLocalSlipFile(null);
        setSubmitStatus({ type: null, message: "" });
      }, 3000);
    } catch (err: any) {
      console.error("Order submission error:", err);

      // Dismiss any loading toasts
      toast.dismiss("order-process");
      toast.dismiss("payment-slip-upload");

      // Extract error message
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to place order. Please try again or contact support.";

      setSubmitStatus({ type: "error", message: errorMessage });
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (storedCartItems.length === 0) return;

    const orderItemsArray = storedCartItems.map((item) => ({
      product_id: item.id,
      required_quantity: item.quantity,
    }));

    calculateOrderValue({ orderItemsArray });
  }, [calculateOrderValue, storedCartItems]);

  // Show toast when calculation fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to calculate order value. Please try again.");
    }
  }, [error]);

  // Clear payment fields when COD is selected
  useEffect(() => {
    if (isCOD) {
      form.setValue("paymentData.payment_date", undefined);
      form.setValue("paymentData.paid_amount", undefined);
      form.setValue("paymentData.payment_slip_number", undefined);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalSlipFile(null);
    }
  }, [isCOD, form]);

  const getErrorMessage = (error: any) => {
    return error?.message || "";
  };

  const isSubmitting = isCreatingOrder || isUploadingPaymentSlip;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Global Status Messages */}
        {submitStatus.type && (
          <Alert
            className={`mb-6 ${
              submitStatus.type === "success"
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            {submitStatus.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={
                submitStatus.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }
            >
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty Cart Warning */}
        {storedCartItems.length === 0 && (
          <Alert className="mb-6 border-yellow-500 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Your cart is empty. Please add items to proceed with checkout.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...form.register("orderMetaData.first_name")}
                      className={
                        form.formState.errors.orderMetaData?.first_name
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {form.formState.errors.orderMetaData?.first_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {getErrorMessage(
                          form.formState.errors.orderMetaData.first_name
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...form.register("orderMetaData.last_name")}
                      className={
                        form.formState.errors.orderMetaData?.last_name
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {form.formState.errors.orderMetaData?.last_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {getErrorMessage(
                          form.formState.errors.orderMetaData.last_name
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0771122345"
                      {...form.register("orderMetaData.primary_phone_number")}
                      className={
                        form.formState.errors.orderMetaData
                          ?.primary_phone_number
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {form.formState.errors.orderMetaData
                      ?.primary_phone_number && (
                      <p className="text-red-500 text-sm mt-1">
                        {getErrorMessage(
                          form.formState.errors.orderMetaData
                            .primary_phone_number
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPhone">Confirm Phone Number *</Label>
                    <Input
                      id="confirmPhone"
                      type="tel"
                      placeholder="0771122345"
                      {...form.register("orderMetaData.confirm_phone_number")}
                      onBlur={validatePhoneMatch}
                      className={
                        form.formState.errors.orderMetaData
                          ?.confirm_phone_number
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {form.formState.errors.orderMetaData
                      ?.confirm_phone_number && (
                      <p className="text-red-500 text-sm mt-1">
                        {getErrorMessage(
                          form.formState.errors.orderMetaData
                            .confirm_phone_number
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      placeholder="123 Main Street"
                      {...form.register("orderMetaData.address_line_1")}
                      className={
                        form.formState.errors.orderMetaData?.address_line_1
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {form.formState.errors.orderMetaData?.address_line_1 && (
                      <p className="text-red-500 text-sm mt-1">
                        {getErrorMessage(
                          form.formState.errors.orderMetaData.address_line_1
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      placeholder="Apartment, suite, etc. (optional)"
                      {...form.register("orderMetaData.address_line_2")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressLine3">Address Line 3</Label>
                    <Input
                      id="addressLine3"
                      placeholder="Additional address info (optional)"
                      {...form.register("orderMetaData.address_line_3")}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        placeholder="10001"
                        type="number"
                        {...form.register("orderMetaData.postal_code", {
                          valueAsNumber: true,
                        })}
                        className={
                          form.formState.errors.orderMetaData?.postal_code
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {form.formState.errors.orderMetaData?.postal_code && (
                        <p className="text-red-500 text-sm mt-1">
                          {getErrorMessage(
                            form.formState.errors.orderMetaData.postal_code
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details - Accordion */}
              <BankDetails />

              {/* Payment Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select
                        value={form.getValues("orderMetaData.payment_method")}
                        onValueChange={(value) =>
                          form.setValue(
                            "orderMetaData.payment_method",
                            value as PaymentMethod,
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            }
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHOD_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.orderMetaData?.payment_method && (
                        <p className="text-red-500 text-sm mt-1">
                          {getErrorMessage(
                            form.formState.errors.orderMetaData.payment_method
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="paymentDate">
                        Payment Date {!isCOD && "*"}
                      </Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        disabled={isCOD}
                        value={
                          (
                            form.getValues("paymentData.payment_date") ?? ""
                          ).split("T")[0] || ""
                        }
                        onChange={(e) => {
                          const utcString = new Date(
                            e.target.value
                          ).toISOString();

                          form.setValue(
                            "paymentData.payment_date",
                            utcString || "",
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            }
                          );
                        }}
                        className={`${
                          form.formState.errors.paymentData?.payment_date
                            ? "border-red-500"
                            : ""
                        } ${isCOD ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                      {form.formState.errors.paymentData?.payment_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {getErrorMessage(
                            form.formState.errors.paymentData.payment_date
                          )}
                        </p>
                      )}
                      {isCOD && (
                        <p className="text-gray-500 text-xs mt-1">
                          Not required for Cash on Delivery
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paidAmount">
                        Paid Amount {!isCOD && "*"}
                      </Label>
                      <Input
                        id="paidAmount"
                        placeholder="1000"
                        type="number"
                        disabled={isCOD}
                        {...form.register("paymentData.paid_amount", {
                          valueAsNumber: true,
                        })}
                        className={`${
                          form.formState.errors.paymentData?.paid_amount
                            ? "border-red-500"
                            : ""
                        } ${isCOD ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                      {form.formState.errors.paymentData?.paid_amount && (
                        <p className="text-red-500 text-sm mt-1">
                          {getErrorMessage(
                            form.formState.errors.paymentData.paid_amount
                          )}
                        </p>
                      )}
                      {isCOD && (
                        <p className="text-gray-500 text-xs mt-1">
                          Not required for Cash on Delivery
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="paymentSlipNumber">
                        Payment Slip Number {!isCOD && "*"}
                      </Label>
                      <Input
                        id="paymentSlipNumber"
                        placeholder="12345"
                        maxLength={5}
                        disabled={isCOD}
                        {...form.register("paymentData.payment_slip_number")}
                        className={`${
                          form.formState.errors.paymentData?.payment_slip_number
                            ? "border-red-500"
                            : ""
                        } ${isCOD ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                      {form.formState.errors.paymentData
                        ?.payment_slip_number && (
                        <p className="text-red-500 text-sm mt-1">
                          {getErrorMessage(
                            form.formState.errors.paymentData
                              .payment_slip_number
                          )}
                        </p>
                      )}
                      {isCOD && (
                        <p className="text-gray-500 text-xs mt-1">
                          Not required for Cash on Delivery
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Payment Slip */}
              {!isCOD && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">
                    Upload Payment Slip
                  </h2>
                  <div>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file size (max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            const errorMsg = "File size must be less than 5MB";
                            setSubmitStatus({
                              type: "error",
                              message: errorMsg,
                            });
                            toast.error(errorMsg);
                            return;
                          }
                          setLocalSlipFile(file);
                          setSubmitStatus({ type: null, message: "" });
                          toast.success(
                            `File "${file.name}" selected successfully`
                          );
                        }
                      }}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary/90
                        cursor-pointer"
                    />
                    {localSlipFile && (
                      <div className="mt-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-gray-600">
                          Selected: {localSlipFile.name}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Accepted formats: JPG, PNG, PDF (Max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* COD Notice */}
              {isCOD && (
                <Alert className="mb-4 border-blue-500 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    Payment details are not required for Cash on Delivery
                    orders.
                  </AlertDescription>
                </Alert>
              )}

              {/* Cart Items */}
              <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                {storedCartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        Rs:{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Calculation Status */}
              {error && (
                <Alert className="mb-4 border-red-500 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Problem calculating order value. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              {isLoading && (
                <div className="mb-4 text-center text-sm text-gray-600">
                  <div className="animate-pulse">
                    Calculating order value...
                  </div>
                </div>
              )}

              {/* Pricing Breakdown */}
              {calculationSummary && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      Rs:{calculationSummary.itemsValue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {calculationSummary.courierValue === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `Rs:${calculationSummary.courierValue.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      Rs:{calculationSummary.totalValue.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                className="w-full"
                size="lg"
                disabled={isSubmitting || storedCartItems.length === 0}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
