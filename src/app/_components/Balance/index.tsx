"use client";
import { ReactNode } from "react";

interface BalanceProps {
  title: ReactNode;
  subtitle: ReactNode;
  balance: ReactNode;
  textColor?: string;
  children: ReactNode;
}

export default function Balance({ title, balance, textColor = "text-green-500", subtitle, children }: BalanceProps) {
  
  return (
    <div className="mb-4">
      <h3 className="text-gray-400 flex items-center gap-1">
        {title}
      </h3>
      <div className="my-2 flex items-center justify-between text-2xl font-bold">
        <div className={textColor}>
          {balance}
        </div>
        {children}
      </div>
      <p className="text-gray-400">
        {subtitle}
      </p>
    </div>
  );
}
