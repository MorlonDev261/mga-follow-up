"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type Product = {
  id: string;
  date: string;
  Qte?: number;
  designation: string;
  idProduct: string;
  comments: string;
  amount: number;
  total?: number;
};

const data: Product[] = [
  { id: "1", date: "25-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "Misy dot kely", amount: 2507 },
  { id: "2", date: "25-01-25", designation: "iPhone 11 64", idProduct: "HtGghd3635", comments: "Display message", amount: 316 },
  { id: "3", date: "25-01-25", designation: "iPhone 11 64", idProduct: "HtGghd3635", comments: "", amount: 316 },
  { id: "4", date: "23-01-25", designation: "iPhone XS 256", idProduct: "3662HFCOl", comments: "", amount: 568 },
  { id: "5", date: "23-01-25", designation: "iPhone XS 256", idProduct: "3662HFCOl", comments: "Vente iPhone XS null", amount: 568 },
  { id: "6", date: "23-01-25", designation: "iPhone 8 64", idProduct: "roY46074", comments: "Scrach", amount: 316 },
  { id: "7", date: "28-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "Housing", amount: 2507 },
  { id: "8", date: "28-01-25", designation: "iPhone 11 64", idProduct: "HtGghd3635", comments: "Notif bat", amount: 316 },
  { id: "9", date: "28-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "", amount: 2507 },
  { id: "10", date: "28-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "", amount: 2507 },
];

export default function TableStock() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterIdProduct = searchParams.get("idProduct");
  const filterDate = searchParams.get("date");

  // ✅ État pour activer/désactiver le regroupement
  const [grouped, setGrouped] = React.useState(true);
  const [search, setSearch] = React.useState("");

  // ✅ Regroupement des produits
  const groupedData = Object.values(
    data.reduce((acc, item) => {
      const key = `${item.idProduct}-${item.designation}-${item.date}`;
      if (!acc[key]) {
        acc[key] = { ...item, Qte: 1, total: item.amount };
      } else {
        acc[key].Qte += 1;
        acc[key].total += item.amount;
      }
      return acc;
    }, {} as Record<string, Product & { Qte: number; total: number }>)
  );

  // ✅ Sélection des données affichées en fonction des filtres
  let displayedData = grouped ? groupedData : data;

  if (filterIdProduct && filterDate) {
    displayedData = data.filter((p) => p.idProduct === filterIdProduct && p.date === filterDate);
  } else if (filterIdProduct) {
    displayedData = data.filter((p) => p.idProduct === filterIdProduct);
  }

  // ✅ Filtrage en fonction de la barre de recherche
  displayedData = displayedData.filter((p) => {
    if (filterIdProduct) return p.comments.toLowerCase().includes(search.toLowerCase());
    return (
      p.date.includes(search) ||
      p.designation.toLowerCase().includes(search.toLowerCase()) ||
      (!grouped && p.comments.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // ✅ Colonnes du tableau
  const columns: ColumnDef<Product>[] = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "designation", header: "Designation" },
    !grouped ? { accessorKey: "comments", header: "Comments" } : { accessorKey: "Qte", header: "Qte" },
    { 
      accessorKey: "amount", 
      header: "Price", 
      cell: ({ row }: { row: Row<Product> }) => <div className="text-right font-medium">{row.getValue("amount")}</div> 
    },

    ...(grouped ? [
    { 
      accessorKey: "total", 
      header: "Total", 
      cell: ({ row }: { row: Row<Product> }) => <div className="text-right font-medium">{row.getValue("total")}</div> 
    }
    ] : []),
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                const newParams = new URLSearchParams();
                newParams.set("idProduct", row.original.idProduct);
                newParams.set("date", row.original.date);
                router.push(`?${newParams.toString()}`);
              }}
            >
              View Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({ data: displayedData, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel() });

  return (
    <div className="w-full bg-[#111]">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline" onClick={() => setGrouped(!grouped)}>
          {grouped ? "One by One" : "Group"}
        </Button>
        <Button variant="outline" className="ml-auto" onClick={() => router.push("/stock")}>
          Go Back
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>{row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>
            )) : <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
