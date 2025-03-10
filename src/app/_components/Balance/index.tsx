"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BalanceProps {
  title?: ReactNode;
  titleColor?: string;
  titleSize?: string;
  subtitle?: ReactNode;
  subtitleColor?: string;
  subtitleSize?: string;
  balance?: ReactNode;
  balanceColor?: string;
  balanceSize?: string
  children?: ReactNode;
}

export default function Balance({ title, titleColor, titleSize, balance, balanceColor, balanceSize, subtitle, subtitleColor, subtitleSize, children }: BalanceProps) {
  
  return (
    <div className="p-1">
      <h3 className={cn("flex items-center gap-1", titleColor ? titleColor: "text-gray-400", titleSize)}>
        {title}
      </h3>
      <div className="my-2 flex items-center justify-between font-bold">
        <div className={cn(balanceColor ? balanceColor : "text-green-500", balanceSize ? balanceSize : "text-2xl")}>
          {balance}
        </div>
        {children}
      </div>
      <p className={cn(subtitleColor ? subtitleColor : "text-gray-400", subtitleSize)}>
        {subtitle}
      </p>
    </div>
  );
}
