"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  className?: string;
  noStyled?: boolean;
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function AppDialog({
  className,
  noStyled,
  isOpen,
  onClose,
  title,
  description,
  children,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && onClose) onClose(); }}>
      <DialogContent className={cn("w-[90%] max-w-2xl mx-auto", className)}>
        {!noStyled && (
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        )}
        <div className="grid gap-4 py-4">
          {children}
        </div>
        {!noStyled && (
        <DialogFooter>
          <DialogClose className="btn-secondary">Annuler</DialogClose>
        </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
