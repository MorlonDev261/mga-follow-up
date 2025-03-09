"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface TableFilterProps<TData> {
  table: Table<TData>;
  accessorKey?: string[]; // Liste des colonnes à filtrer
}

export default function TableFilter<TData>({ table, accessorKey }: TableFilterProps<TData>) {
  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilterValue(value);

    // Construire les filtres pour chaque colonne spécifiée
    const filters = (accessorKey && accessorKey.length > 0
      ? accessorKey
      : ["date"] // Si aucune colonne spécifiée, filtrer la date
    ).map((key) => ({ id: key, value }));

    // Appliquer les filtres
    table.setColumnFilters(filters);
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
