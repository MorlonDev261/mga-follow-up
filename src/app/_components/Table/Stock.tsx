"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TableFilter from "@components/Table/Config/TableFilter";
import { ChevronDown, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Product = {
  id: number;
  productId: string;
  productName: string;
  date: Date;
  dateStock: string;
  comment: string;
};

interface TransactionsProps {
  Columns: ColumnDef<Product>[];
  data: Product[];
  loading: boolean;
}

const DataTable: React.FC<TransactionsProps> = React.memo(({ Columns, data, loading }) => {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  const table = useReactTable({
    data,
    columns: Columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const goToPreviousPage = React.useCallback(() => table.previousPage(), [table]);
  const goToNextPage = React.useCallback(() => table.nextPage(), [table]);

  const handlePageSizeChange = (value: string) => {
    table.setPageSize(Number(value));
  };

  return (
    <div className="w-full px-2">
      {/* Barre de filtres et export */}
      <div className="flex flex-wrap items-center gap-2 py-2">
        <TableFilter table={table} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto" aria-label="Export options">
              Export <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="capitalize">Export to Excel file</DropdownMenuItem>
            <DropdownMenuItem className="capitalize">Send as message</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tableau ou chargement */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="w-6 h-6 animate-spin" aria-label="Loading..." />
        </div>
      ) : (
        <div className="rounded-md border overflow-auto">
          <Table aria-label="Payments Data Table">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} scope="col">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={Columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 py-4">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Select onValueChange={handlePageSizeChange} defaultValue="10">
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

DataTable.displayName = "DataTable";

export default DataTable;
