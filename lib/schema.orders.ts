import { z } from "zod";
import {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  SELLING_METHODS,
} from "./constants/orders";

const PaymentMethodSchema = z.nativeEnum(PAYMENT_METHODS);
const OrderStatusSchema = z.nativeEnum(ORDER_STATUSES);
const SellingMethodSchema = z.nativeEnum(SELLING_METHODS);

export const orderMetaDataSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  admin_message: z
    .string()
    .max(500, "Admin message must be at most 500 characters")
    .optional(),
  selling_method: SellingMethodSchema,
  order_value: z.number().min(0, "Order value must be at least 0"),
  address_line_1: z.string().min(1, "Address line 1 is required"),
  address_line_2: z.string().optional(),
  address_line_3: z.string().optional(),
  postal_code: z.string().optional(),
  primary_phone_number: z.string().min(10, "Primary phone number is required"),
  confirm_phone_number: z.string().min(10, "Confirm phone number is required"),
  status: OrderStatusSchema,
  payment_method: PaymentMethodSchema,
  company_name: z.string().optional(),
  email: z.union([z.string().email(), z.literal(""), z.undefined()]),
  alternate_phone_number_1: z.union([
    z.string().min(10),
    z.literal(""),
    z.undefined(),
  ]),
  alternate_phone_number_2: z.union([
    z.string().min(10),
    z.literal(""),
    z.undefined(),
  ]),
});

export const orderItemsDataSchema = z
  .array(
    z.object({
      product_id: z.string().min(1, "Product ID is required"),
      required_quantity: z
        .number()
        .min(1, "Required quantity must be at least 1"),
    })
  )
  .min(1, "At least one product is required");

export const paymentDataSchema = z.object({
  payment_date: z.string().optional().nullable(),
  paid_amount: z.number().optional().nullable(),
  payment_slip_number: z.string().optional().nullable(),
});

export const onlineManualOrderSchema = z
  .object({
    orderMetaData: orderMetaDataSchema,
    orderItemsData: orderItemsDataSchema,
    paymentData: paymentDataSchema,
  })
  .superRefine((data, ctx) => {
    const { payment_method } = data.orderMetaData;

    if (
      payment_method === PAYMENT_METHODS.FULL_PAYMENT ||
      payment_method === PAYMENT_METHODS.PARTIAL_PAYMENT
    ) {
      if (!data.paymentData.payment_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["paymentData", "payment_date"],
          message: "Payment date is required for this payment method",
        });
      }
      if (
        data.paymentData.paid_amount === undefined ||
        data.paymentData.paid_amount === null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["paymentData", "paid_amount"],
          message: "Paid amount is required for this payment method",
        });
      }
    }
  });

export const paymentRecordSchema = paymentDataSchema;
