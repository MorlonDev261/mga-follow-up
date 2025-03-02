"use client";

import { useEffect, useMemo, useState } from "react";
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

type Product = {
  id: string;
  date: string;
  Qte?: number;
  designation: string;
  idProduct: string;
  comments: string;
  amount: number;
  total?: number;
};

type GroupedProduct = Product & { Qte: number; total: number };

export default function TableStock() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [grouped, setGrouped] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stock');
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error("Erreur lors de la récupération des données :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoized grouped data
  const groupedData = useMemo(() => {
    return Object.values(
      data.reduce((acc: Record<string, GroupedProduct>, item) => {
        const key = `${item.idProduct}-${item.designation}-${item.date}`;
        if (!acc[key]) {
          acc[key] = { ...item, Qte: 1, total: item.amount };
        } else {
          acc[key].Qte += 1;
          acc[key].total += item.amount;
        }
        return acc;
      }, {})
    );
  }, [data]);

  // Get URL params
  const filterIdProduct = searchParams.get("idProduct");
  const filterDate = searchParams.get("date");

  // Filtered data
  const filteredData = useMemo(() => {
    let result = grouped ? groupedData : data;

    if (filterIdProduct && filterDate) {
      result = result.filter(p => 
        p.idProduct === filterIdProduct && 
        p.date === filterDate
      );
    } else if (filterIdProduct) {
      result = result.filter(p => p.idProduct === filterIdProduct);
    }

    return result.filter(p => {
      const searchLower = search.toLowerCase();
      return (
        p.date.includes(searchLower) ||
        p.designation.toLowerCase().includes(searchLower) ||
        (!grouped && p.comments.toLowerCase().includes(searchLower))
      );
    });
  }, [data, groupedData, grouped, filterIdProduct, filterDate, search]);

  // Columns configuration
  const columns = useMemo<ColumnDef<Product | GroupedProduct>[]>(
  () => [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "designation", header: "Designation" },
    { 
      accessorKey: grouped ? "Qte" : "comments", 
      header: grouped ? "Qte" : "Comments" 
    },
    { 
      accessorKey: "amount", 
      header: "Price", 
      cell: ({ row }: { row: Row<Product | GroupedProduct> }) => (
        <div className="text-right">{row.getValue("amount")}</div>
      ),
    },
    ...(grouped ? [{
      accessorKey: "total",
      header: "Total",
      cell: ({ row }: { row: Row<Product | GroupedProduct> }) => (
        <div className="text-right">{row.getValue("total")}</div>
      ),
    }] : []),
    {
      id: "actions",
      cell: ({ row }: { row: Row<Product | GroupedProduct> }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                const params = new URLSearchParams();
                params.set("idProduct", row.original.idProduct);
                params.set("date", row.original.date);
                router.push(`?${params.toString()}`);
              }}
            >
              Voir le produit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ],
  [grouped, router]
);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <div className="p-4 text-center">Chargement...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="w-full bg-[#111] p-4">
  <div className="flex flex-wrap items-center py-4 gap-2">
    <Input
      placeholder="Rechercher..."
      className="max-w-xs sm:max-w-sm"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <Button variant="outline" onClick={() => setGrouped(!grouped)}>
      {grouped ? "Vue détaillée" : "Vue groupée"}
    </Button>
    <Button
      variant="outline"
      className="ml-auto"
      onClick={() => router.push("/stock")}
    >
      Retour
    </Button>
  </div>

  {/* Conteneur responsive */}
  <div className="rounded-md border overflow-x-auto">
    <Table className="min-w-max w-full">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="bg-gray-800">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="px-2 py-3 text-xs sm:text-sm">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} className="text-xs sm:text-sm">
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="px-2 py-2 whitespace-nowrap">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>

  <div className="flex items-center justify-between space-x-2 py-4 text-xs sm:text-sm">
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      Précédent
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      Suivant
    </Button>
  </div>
</div>
  );
}
