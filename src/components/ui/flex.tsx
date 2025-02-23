"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  gap?: string;
  justify?: "start" | "center" | "end" | "between" | "around";
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction = "row", gap = "2", justify = "start", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          `flex flex-${direction} gap-${gap} justify-${justify}`,
          className
        )}
        {...props}
      />
    );
  }
);

Flex.displayName = "Flex";
