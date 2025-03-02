"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  Row,
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
  Qte?: number;
  designation: string;
  idProduct: string;
  comments: string;
  amount: number;
  total?: number;
};

const data: Product[] = [
  { id: "1", date: "23-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "Misy dot kely", amount: 2507 },
  { id: "2", date: "23-01-25", designation: "iPhone 11 64", idProduct: "HtGghd3635", comments: "Display message", amount: 316 },
  { id: "3", date: "23-01-25", designation: "iPhone 11 64", idProduct: "HtGghd3635", comments: "", amount: 316 },
  { id: "4", date: "23-01-25", designation: "iPhone XS 256", idProduct: "3662HFCOl", comments: "", amount: 568 },
  { id: "5", date: "23-01-25", designation: "iPhone XS 256", idProduct: "3662HFCOl", comments: "Vente iPhone XS null", amount: 568 },
  { id: "6", date: "23-01-25", designation: "iPhone 8 64", idProduct: "roY46074", comments: "Scrach", amount: 316 },
  { id: "7", date: "23-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "Housing", amount: 2507 },
  { id: "8", date: "23-01-25", designation: "iPhone 11 64", idProduct: "HtGghd3635", comments: "Notif bat", amount: 316 },
  { id: "9", date: "23-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "", amount: 2507 },
  { id: "10", date: "23-01-25", designation: "iPhone 11 128", idProduct: "6784geH", comments: "", amount: 2507 },
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

  const columns: ColumnDef<Product>[] = [
  { accessorKey: "date", header: "Date", cell: ({ row }: { row: Row<Product> }) => <div>{row.getValue("date")}</div> },
  { accessorKey: "designation", header: "Designation", cell: ({ row }: { row: Row<Product> }) => <div>{row.getValue("designation")}</div> },

  filterIdProduct
    ? { accessorKey: "comments", header: "Comments", cell: ({ row }: { row: Row<Product> }) => <div>{row.getValue("comments")}</div> } 
    : { accessorKey: "Qte", header: "Qte", cell: ({ row }: { row: Row<Product> }) => <div>{row.getValue("Qte")}</div> } ,

  {
    accessorKey: "amount",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }: { row: Row<Product> }) => <div className="text-right font-medium">{row.getValue("amount")}</div>,
  },

  ...(!filterIdProduct
    ? [
        {
          accessorKey: "total",
          header: () => <div className="text-right">Total</div>,
          cell: ({ row }: { row: Row<Product> }) => <div className="text-right font-medium">{row.getValue("total")}</div>,
        },
      ]
    : []),

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: { row: Row<Product> }) => {
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
];

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
    <div className="w-full bg-[#111]">
  <div className="flex items-center py-4 gap-2">
    <Input
      placeholder="Filter comments..."
      className="max-w-sm"
      onChange={(event) => table.getColumn("comments")?.setFilterValue(event.target.value)}
    />
    <Button variant="outline" className="ml-auto" onClick={() => router.push("/stock")}>
      Go Back
    </Button>
  </div>

  {/* ✅ Ajout du div overflow-x-auto */}
  <div className="rounded-md border overflow-x-auto">
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="text-sm md:text-base">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="whitespace-nowrap text-sm md:text-base"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
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
