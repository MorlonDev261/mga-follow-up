"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
  designation: string;
  idProduct: string;
  comments: string;
  amount: number;
};

const data: Product[] = [
  { id: "1", date: "23-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "Vente iPhone XR 3pcs", amount: 316 },
  { id: "2", date: "23-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "Vente iPhone XR 3pcs", amount: 316 },
  { id: "3", date: "23-01-25", designation: "iPhone 11 64", idProduct: "HtGghd3635", comments: "Vente iPhone XR 3pcs", amount: 316 },
  { id: "4", date: "23-01-25", designation: "iPhone 11 128", idProduct: "HtGghd3635", comments: "Vente iPhone XR 3pcs", amount: 316 },
  { id: "5", date: "23-01-25", designation: "iPhone 11 128", idProduct: "67880GgeH", comments: "Vente iPhone XR 3pcs", amount: 316 },
];

// ✅ Regrouper les produits par `idProduct` et `designation`
const groupedData = Object.values(
  data.reduce((acc, item) => {
    const key = `${item.idProduct}-${item.designation}`;
    if (!acc[key]) {
      acc[key] = { ...item, Qte: 1, total: item.amount };
    } else {
      acc[key].Qte += 1;
      acc[key].total += item.amount;
    }
    return acc;
  }, {} as Record<string, Product & { Qte: number; total: number }>)
);

export default function TableStock() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterIdProduct = searchParams.get("idProduct");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  // ✅ Si un idProduct est dans l'URL, filtrer les produits
  const filteredData = filterIdProduct
    ? data.filter((item) => item.idProduct === filterIdProduct)
    : groupedData;

  const columns: ColumnDef<Product & { Qte?: number; total?: number }>[] = [
  { accessorKey: "date", header: "Date", cell: ({ row }) => <div>{row.getValue("date")}</div> },
  { accessorKey: "designation", header: "Designation", cell: ({ row }) => <div>{row.getValue("designation")}</div> },

  filterIdProduct
    ? { accessorKey: "comments", header: "Comments", cell: ({ row }) => <div>{row.getValue("comments")}</div> }
    : { accessorKey: "Qte", header: "Qte", cell: ({ row }) => <div>{Qte)}</div> } ,

  {
    accessorKey: "amount",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => <div className="text-right font-medium">{row.getValue("amount")}</div>,
  },

  !filterIdProduct
    ? {
        accessorKey: "total",
        header: () => <div className="text-right">Total</div>,
        cell: ({ row }) => <div className="text-right font-medium">{total}</div>,
      }
    : null, // ⬅️ Ajout de null pour éviter d'insérer une valeur invalide

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                const newParams = new URLSearchParams();
                newParams.set("idProduct", product.idProduct);
                router.push(`?${newParams.toString()}`);
              }}
            >
              View Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
].filter(Boolean); // ✅ Filtre les `undefined` pour éviter des erreurs

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter comments..."
          className="max-w-sm"
          onChange={(event) => table.getColumn("comments")?.setFilterValue(event.target.value)}
        />
        <Button variant="outline" className="ml-auto" onClick={() => router.push("/")}>
          Reset
        </Button>
      </div>
      <div className="rounded-md border">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
