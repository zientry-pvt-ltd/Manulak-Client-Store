"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SuccessDialog({
  orderId,
  open,
  onOpenChange,
}: {
  orderId: string | null;
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const navigate = useRouter();

  const copyToClipboard = () => {
    if (!orderId) return;
    try {
      navigator.clipboard.writeText(orderId);
      toast.success("Order ID copied to clipboard");

      setTimeout(() => {
        navigate.push("/products");
      }, 500);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to copy order ID to clipboard:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    navigate.push("/products");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-green-700">
            Order Placed Successfully!
          </DialogTitle>
          <DialogDescription>
            Your order has been submitted. Use the Order ID below to track
            progress or contact support.
          </DialogDescription>
        </DialogHeader>

        {orderId && (
          <div className="grid gap-3 bg-green-50 border border-green-300 rounded-md p-3">
            <p className="font-semibold text-green-900">Order ID</p>

            <div className="flex items-center justify-between bg-white border border-green-200 rounded-md px-3 py-2">
              <span className="font-mono text-green-800 wrap-anywhere">
                {orderId}
              </span>

              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                Copy
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
