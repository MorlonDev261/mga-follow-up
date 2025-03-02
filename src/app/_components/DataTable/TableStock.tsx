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
  year?: string;
  month?: string;
  day?: string;
  monthName?: string;
};

type GroupedProduct = Product & { Qte: number; total: number };

const monthNames = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
];

function parseDateTerm(term: string) {
  // Gestion des formats de date
  const dateFormats = [
    { regex: /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/, parts: ['day', 'month', 'year'] }, // DD/MM/YYYY
    { regex: /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/, parts: ['year', 'month', 'day'] }, // YYYY/MM/DD
    { regex: /^(\d{1,2})[\/\-](\d{1,2})$/, parts: ['day', 'month'] }, // DD/MM
    { regex: /^(\d{1,2})\s([a-zA-Z]+)$/i }, // 23 mars
    { regex: /^([a-zA-Z]+)\s(\d{4})$/i }, // mars 2024
    { regex: /^([a-zA-Z]+)$/i }, // mars
    { regex: /^(\d{4})$/, parts: ['year'] }, // 2024
    { regex: /^(\d{1,2})$/, parts: ['day-or-month'] }, // 23 ou 03
  ];

  for (const format of dateFormats) {
    const match = term.match(format.regex);
    if (match) {
      // Gestion des combinaisons spéciales
      if (format.regex.source === '^(\d{1,2})\\s([a-zA-Z]+)$/i') {
        const [, day, month] = match;
        const monthIndex = monthNames.findIndex(m => m.startsWith(month.toLowerCase()));
        if (monthIndex > -1) {
          return {
            day: day.padStart(2, '0'),
            month: String(monthIndex + 1).padStart(2, '0'),
          };
        }
      }
      
      if (format.regex.source === '^([a-zA-Z]+)\\s(\\d{4})$/i') {
        const [, month, year] = match;
        const monthIndex = monthNames.findIndex(m => m.startsWith(month.toLowerCase()));
        if (monthIndex > -1) {
          return {
            month: String(monthIndex + 1).padStart(2, '0'),
            year
          };
        }
      }

      if (format.regex.source === '^([a-zA-Z]+)$/i') {
        const monthIndex = monthNames.findIndex(m => m.startsWith(term.toLowerCase()));
        if (monthIndex > -1) {
          return {
            month: String(monthIndex + 1).padStart(2, '0'),
            monthName: monthNames[monthIndex]
          };
        }
      }

      if (format.parts) {
        const parts = match.slice(1);
        const result: Record<string, string> = {};
        format.parts.forEach((part, index) => {
          if (part === 'day-or-month') {
            const value = parts[index].padStart(2, '0');
            if (parseInt(value) <= 12) {
              result.month = value;
            } else {
              result.day = value;
            }
          } else {
            result[part] = parts[index].padStart(part === 'year' ? 4 : 2, '0');
          }
        });
        return result;
      }
    }
  }
  return null;
}

export default function TableStock() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [grouped, setGrouped] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stock');
        const data = await response.json();
        const enrichedData = data.map((product: Product) => {
          const date = new Date(product.date);
          return {
            ...product,
            year: String(date.getFullYear()),
            month: String(date.getMonth() + 1).padStart(2, '0'),
            day: String(date.getDate()).padStart(2, '0'),
            monthName: monthNames[date.getMonth()]
          };
        });
        setData(enrichedData);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error("Erreur lors de la récupération des données :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const filterIdProduct = searchParams.get("idProduct");
  const filterDate = searchParams.get("date");

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

    const searchTerms = search.toLowerCase().split(/\s+/);
    const dateConditions: Record<string, string>[] = [];
    const textTerms: string[] = [];

    searchTerms.forEach(term => {
      const dateParts = parseDateTerm(term);
      if (dateParts) {
        dateConditions.push(dateParts);
      } else {
        textTerms.push(term);
      }
    });

    return result.filter(p => {
      // Vérification des conditions de date
      const dateMatch = dateConditions.every(cond => {
        return Object.entries(cond).every(([key, value]) => {
          if (key === 'monthName') return p.monthName === value;
          return p[key as keyof Product] === value;
        });
      });

      // Vérification des termes textuels
      const textMatch = textTerms.every(term => {
        return p.designation.toLowerCase().includes(term) ||
          (!grouped && p.comments.toLowerCase().includes(term));
      });

      return dateMatch && textMatch;
    });
  }, [data, groupedData, grouped, filterIdProduct, filterDate, search]);

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
          {loading || error ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                {loading ? "Chargement..." : <span className="text-red-500">{error}</span>}
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="text-xs sm:text-sm">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-2 py-2 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                Aucun produit trouvé.
              </TableCell>
            </TableRow>
          )}
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
