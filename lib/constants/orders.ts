export const SELLING_METHODS = {
  ONLINE: "ONLINE",
  PLANT_NURSERY: "PLANT_NURSERY",
} as const;

export const PAYMENT_METHODS = {
  COD: "COD",
  FULL_PAYMENT: "FULL_PAYMENT",
  PARTIAL_PAYMENT: "PARTIAL_PAYMENT",
} as const;

export const ORDER_STATUSES = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  COMPLETE: "COMPLETE",
} as const;

export const PAYMENT_METHOD_OPTIONS = [
  {
    label: "CoD",
    value: PAYMENT_METHODS.COD,
  },
  {
    label: "Full Payment",
    value: PAYMENT_METHODS.FULL_PAYMENT,
  },
  {
    label: "Partial Payment",
    value: PAYMENT_METHODS.PARTIAL_PAYMENT,
  },
];
