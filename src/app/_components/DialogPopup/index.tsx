"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, ReactNode } from "react";

interface DialogPopupProps {
  label: ReactNode;
  title: string;
  desc: string;
  children?: ReactNode;
}

export function DialogPopup({ label, title, desc, children }: DialogPopupProps) {
  const [name, setName] = useState("Freja Johnsen");
  const [email, setEmail] = useState("freja@example.com");

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>{label}</button> {/* Ajout d'un wrapper pour gérer tout type de label */}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          <Dialog.Description className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
