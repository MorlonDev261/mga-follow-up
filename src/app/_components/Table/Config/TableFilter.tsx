import { useCallback, useMemo, useRef } from "react";
import { Table, Row } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";

type TableFilterProps<T extends Record<string, unknown>> = {
  table: Table<T>;
  accessorKeys?: (keyof T)[];
  placeholder?: string;
  className?: string;
};

export default function TableFilter<T extends Record<string, unknown>>({
  table,
  accessorKeys,
  placeholder = "Search...",
  className = "max-w-sm",
}: TableFilterProps<T>) {
  const applyFilter = useCallback(
    (searchValue: string) => {
      const searchWords = searchValue.trim().toLowerCase().split(/\s+/);

      if (accessorKeys) {
        table.setColumnFilters(
          accessorKeys.flatMap((key) =>
            searchWords.map((word) => ({
              id: key as string,
              value: word,
            }))
          )
        );
      } else {
        table.setGlobalFilter((row: Row<T>) => {
          const rowValues = Object.values(row.original).join(" ").toLowerCase();
          return searchWords.every((word) => rowValues.includes(word));
        });
      }
    },
    [accessorKeys, table]
  );

  // Utilisation de useRef pour éviter la recréation du debounce
  const debouncedFilterRef = useRef(
    debounce((searchValue: string) => applyFilter(searchValue), 300)
  );

  // Gestion du changement de l'input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    debouncedFilterRef.current(searchValue);
  };

  return (
    <Input
      placeholder={placeholder}
      onChange={handleChange}
      className={className}
      aria-label="Search table"
    />
  );
}
