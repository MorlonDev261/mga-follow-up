"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: keyof JSX.IntrinsicElements;
  size?: "sm" | "md" | "lg";
  weight?: "normal" | "bold";
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, as: Component = "p", size = "md", weight = "normal", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          {
            sm: "text-sm",
            md: "text-base",
            lg: "text-lg",
          }[size],
          {
            normal: "font-normal",
            bold: "font-bold",
          }[weight],
          className
        )}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";
