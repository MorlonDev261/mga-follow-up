"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import moment from "moment";

interface TableFilterProps<TData> {
  table: Table<TData>;
}

export default function TableFilter<TData>({ table }: TableFilterProps<TData>) {
  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilterValue(value);

    // Vérifier si l'utilisateur entre une date (format DD/MM/YYYY)
    const isDate = moment(value, "DD/MM/YYYY", true).isValid();

    table.getColumn("fullName")?.setFilterValue(isDate ? "" : value);
    table.getColumn("date")?.setFilterValue(isDate ? moment(value, "DD/MM/YYYY").format("YYYY-MM-DD") : "");
  };

  return (
    <Input
      placeholder="Search by name or date (DD/MM/YYYY)..."
      value={filterValue}
      onChange={handleFilterChange}
      className="max-w-sm"
    />
  );
}
