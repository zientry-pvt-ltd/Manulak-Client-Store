import { useCallback } from "react";
import { SanitizerConfig } from "@/types/common";
import { createInputSanitizer } from "@/lib/utils";

export const useSanitizedInput = (config: SanitizerConfig) => {
  const sanitizer = createInputSanitizer(config);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      e.currentTarget.value = sanitizer(e.currentTarget.value);
    },
    [sanitizer]
  );

  return { handleInput };
};
