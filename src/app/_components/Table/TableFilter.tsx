"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface TableFilterProps<TData> {
  table: Table<TData>;
  accessorKey?: string[]; // Facultatif : Liste des colonnes à filtrer
}

export default function TableFilter<TData>({
  table,
  accessorKey,
}: TableFilterProps<TData>) {
  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilterValue(value);

    // Si aucune colonne n'est spécifiée, filtrer uniquement la date
    if (!accessorKey || accessorKey.length === 0) {
      table.getColumn("date")?.setFilterValue(value);
      return;
    }

    // Filtrer toutes les colonnes spécifiées + la date
    table.getColumn("date")?.setFilterValue(value);
    accessorKey.forEach((key) => table.getColumn(key)?.setFilterValue(value));
  };

  return (
    <Input
      placeholder="Search..."
      value={filterValue}
      onChange={handleFilterChange}
      className="max-w-sm"
    />
  );
}
