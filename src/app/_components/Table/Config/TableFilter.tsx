import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

type GlobalTableFilterProps<T> = {
  table: Table<T>;
  placeholder?: string;
  className?: string;
};

export default function GlobalTableFilter<T>({
  table,
  placeholder = "Search...",
  className = "max-w-sm",
}: GlobalTableFilterProps<T>) {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getState().globalFilter as string) ?? ""}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
      className={className}
    />
  );
}
