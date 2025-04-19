'use client';

import Dropdown from "@components/Dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FaPlus, FaClipboardUser } from "react-icons/fa6";
import { AiOutlineProduct } from "react-icons/ai";
import { ImUserPlus } from "react-icons/im";
import AddProduct from "@components/Insertion/product";

export default function NewInsertionDropdown() {
  return (
    <Dropdown
      btn={
        <button className="flex items-center justify-center gap-1 rounded bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-2 py-1 text-sm text-white">
          <FaPlus /> New
        </button>
      }
      title="Insertion"
    >
      <DropdownMenuItem>
        <AiOutlineProduct /> <AddProduct />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <ImUserPlus /> New customer
      </DropdownMenuItem>
      <DropdownMenuItem>
        <FaClipboardUser /> New employer
      </DropdownMenuItem>
    </Dropdown>
  );
}
