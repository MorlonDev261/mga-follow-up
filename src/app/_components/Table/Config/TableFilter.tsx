import { Input } from "@/components/ui/input";

type GlobalTableFilterProps = {
  table: any; // Type du tableau, peut être affiné selon ton implémentation
  placeholder?: string;
  className?: string;
};

export default function GlobalTableFilter({
  table,
  placeholder = "Search...",
  className = "max-w-sm",
}: GlobalTableFilterProps) {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getState().globalFilter as string) ?? ""}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
      className={className}
    />
  );
}
