"use client";

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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {label}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          <Dialog.Description className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </Dialog.Description>
          {children}
          <Flex gap="3" justify="end" className="mt-4">
            <Dialog.Close asChild>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button>Save</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
