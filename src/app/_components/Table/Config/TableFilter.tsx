"use client";

import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import moment from "moment";

interface TableFilterInputProps<TData> {
  table: Table<TData>;
  accessorKeys: string[]; // Colonnes à filtrer
}

export default function TableFilterInput<TData>({ table, accessorKeys }: TableFilterInputProps<TData>) {
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();

    accessorKeys.forEach((key) => {
      const column = table.getColumn(key);
      if (column) {
        if (key === "date") {
          // Convertir la date si l'entrée est valide
          const formattedDate = moment(value, "DD/MM/YYYY", true).isValid()
            ? moment(value, "DD/MM/YYYY").format("YYYY-MM-DD")
            : value;
          column.setFilterValue(formattedDate);
        } else {
          column.setFilterValue(value);
        }
      }
    });
  };

  return (
    <Input
      placeholder="Search..."
      onChange={handleFilterChange}
      className="max-w-sm"
    />
  );
}
