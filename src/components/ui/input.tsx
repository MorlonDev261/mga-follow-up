import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
      "focus:outline-none focus:ring-2 focus:ring-gray-900",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
