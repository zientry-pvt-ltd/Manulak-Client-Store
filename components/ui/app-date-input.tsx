/* eslint-disable jsx-a11y/role-supports-aria-props */
import type { LucideProps } from "lucide-react";
import { CalendarRangeIcon, ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface AppDateInputProps {
  label?: string;
  error?: string;
  startIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "fill";
  className?: string;
  fullWidth?: boolean;
  placeholder?: string;
  value?: string; // ISO string format: "2023-10-10T00:00:00.000Z"
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  id?: string;
  hiddenDates?: {
    futureDates?: boolean;
    pastDates?: boolean;
    // eslint-disable-next-line no-unused-vars
    customDates?: (date: Date) => boolean;
  };
}

const sizeClasses: Record<NonNullable<AppDateInputProps["size"]>, string> = {
  sm: "h-9 w-[200px] px-2",
  md: "h-10 w-[250px] px-3",
  lg: "h-12 w-[320px] px-4",
};

const AppDateInput = React.forwardRef<HTMLButtonElement, AppDateInputProps>(
  (
    {
      label,
      error,
      size = "md",
      variant = "outline",
      className,
      fullWidth = false,
      placeholder = "Select date",
      value,
      onChange,
      disabled = false,
      id,
      hiddenDates,
    },
    ref
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputId = id ?? React.useId();
    const [open, setOpen] = React.useState(false);

    // Convert ISO string to Date object
    const selectedDate = value ? new Date(value) : undefined;

    const handleSelect = (date: Date | undefined) => {
      if (date) {
        // Convert to ISO string format with time set to 00:00:00.000Z
        const isoString = date.toISOString();
        onChange?.(isoString);
      } else {
        onChange?.(undefined);
      }
      setOpen(false);
    };

    const formatDate = (date: Date | undefined) => {
      if (!date) return placeholder;
      return date.toLocaleDateString();
    };

    return (
      <div className={cn(fullWidth ? "w-full" : "w-fit", "min-w-[200px]")}>
        {label}

        <Popover open={open} onOpenChange={setOpen} modal={true}>
          <PopoverTrigger asChild>
            <button
              ref={ref}
              id={inputId}
              disabled={disabled}
              className={cn(
                "flex items-center justify-between rounded-md border transition-colors mx-0.5",
                sizeClasses[size],
                variant === "fill" ? "bg-muted/30" : "bg-transparent",
                error
                  ? "border-destructive focus:ring-destructive/30"
                  : "border-input focus:ring-ring/40",
                "focus:ring-1 focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
                fullWidth && "w-full",
                className
              )}
              aria-invalid={!!error}
            >
              <div className="flex items-center flex-1">
                <CalendarRangeIcon className="h-4 w-4 text-muted-foreground mr-2 ml-1" />

                <span className="text-sm font-normal">{formatDate(selectedDate)}</span>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-muted-foreground ml-2" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0 z-9999"
            align="start"
            sideOffset={4}
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              captionLayout="dropdown"
              disabled={disabled}
              hidden={(() => {
                // eslint-disable-next-line no-unused-vars
                const matchers: ((date: Date) => boolean)[] = [];
                if (hiddenDates?.futureDates) {
                  matchers.push((date: Date) => date > new Date());
                }
                if (hiddenDates?.pastDates) {
                  matchers.push(
                    (date: Date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                  );
                }
                if (hiddenDates?.customDates) {
                  matchers.push(hiddenDates.customDates);
                }
                if (matchers.length === 0) return undefined;
                if (matchers.length === 1) return matchers[0];
                return matchers;
              })()}
            />
          </PopoverContent>
        </Popover>

        {error}
      </div>
    );
  }
);

AppDateInput.displayName = "AppDateInput";

export default AppDateInput;
