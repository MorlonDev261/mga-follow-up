"use client";

import * as React from "react";
import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownProps {
  btn: ReactNode;
  title: string;
  children: ReactNode;
}

export default function Dropdown({ btn, title, children }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {btn}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mr-5">
        <DropdownMenuLabel className="text-center">{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
