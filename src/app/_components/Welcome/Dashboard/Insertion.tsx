'use client';

import { useState } from "react";
import Dropdown from "@components/Dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FaPlus, FaClipboardUser } from "react-icons/fa6";
import { AiOutlineProduct } from "react-icons/ai";
import { ImUserPlus } from "react-icons/im";
import DialogPopup from "@components/DialogPopup";
import ProductForm from "@components/Insertion/ProductForm";

export default function NewInsertionDropdown() {
  const [open, setOpen] = useState({ product: false, customer: false, employer: false });

  return (
    <>
      <Dropdown
        btn={
          <button className="flex items-center justify-center gap-1 rounded bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-2 py-1 text-sm text-white">
            <FaPlus /> New
          </button>
        }
        title="Insertion"
      >
        <DropdownMenuItem onClick={() => setOpen({ ...open, product: true })}>
          <AiOutlineProduct /> New product
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOpen({ ...open, customer: true })}>
          <ImUserPlus /> New customer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOpen({ ...open, employer: true })}>
          <FaClipboardUser /> New employer
        </DropdownMenuItem>
      </Dropdown>

      {/* Modale ou panneau d'ajout de produit */}
      <DialogPopup 
        isOpen={open.product} 
        onClose={() => setOpen({ ...open, product: false })}
        title="Ajouter un nouveau produit"
        description="Veuillez remplir les détails du produit à enregistrer."
      >
        <ProductForm setOpen={setOpen} />
      </DialogPopup>
    </>
  );
}
