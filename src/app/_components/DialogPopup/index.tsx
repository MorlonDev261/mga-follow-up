"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { ReactNode } from "react";

interface DialogPopupProps {
  label: ReactNode;
  title: string;
  desc: string;
  children?: ReactNode;
}

export default function DialogPopup({ label, title, desc, children }: DialogPopupProps) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {typeof label === "string" ? <Button>{label}</Button> : label}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          <Dialog.Description className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </Dialog.Description>
          <Flex justify="center" className="p-1">
            {children}
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
