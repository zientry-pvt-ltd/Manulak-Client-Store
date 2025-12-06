import { InputSanitizerType, SanitizerConfig } from "@/types/common";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a sanitizer function based on type
 * @param config - Configuration object with type and optional pattern
 * @returns Function to sanitize input
 */
export const createInputSanitizer = (config: SanitizerConfig) => {
  const patterns: Record<InputSanitizerType, RegExp> = {
    "numbers-only": /[^0-9]/g,
    "letters-only": /[^a-zA-Z]/g,
    alphanumeric: /[^a-zA-Z0-9]/g,
    phone: /[^0-9+\-()]/g,
    email: /[^a-zA-Z0-9@._\-]/g,
    "no-special-chars": /[^a-zA-Z0-9\s]/g,
  };

  const pattern = config.pattern || patterns[config.type];

  return (value: string): string => {
    let sanitized = value.replace(pattern, "");

    if (config.maxLength) {
      sanitized = sanitized.slice(0, config.maxLength);
    }

    return sanitized;
  };
};
