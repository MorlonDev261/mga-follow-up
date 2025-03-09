import { useCallback } from "react";
import { Table, Row } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";

type TableFilterProps<T extends Record<string, unknown>> = {
  table: Table<T>;
  accessorKeys?: (keyof T)[]; // Colonnes spécifiques à filtrer (optionnel)
  placeholder?: string;
  className?: string;
};

/**
 * TableFilter component for filtering table rows globally or by specific columns.
 *
 * @param {Table<T>} table - The table instance from @tanstack/react-table.
 * @param {(keyof T)[]} [accessorKeys] - Optional array of column keys to filter.
 * @param {string} [placeholder="Search..."] - Placeholder text for the input.
 * @param {string} [className="max-w-sm"] - CSS class for the input.
 */
export default function TableFilter<T extends Record<string, unknown>>({
  table,
  accessorKeys,
  placeholder = "Search...",
  className = "max-w-sm",
}: TableFilterProps<T>) {
  // Fonction de filtrage
  const applyFilter = useCallback(
    (searchValue: string) => {
      const searchWords = searchValue.trim().toLowerCase().split(/\s+/);

      if (accessorKeys) {
        // Mode multi-colonnes : Filtrer chaque colonne pour qu'elle contienne au moins un des mots
        table.setColumnFilters(
          accessorKeys.flatMap((key) =>
            searchWords.map((word) => ({
              id: key as string,
              value: word,
            }))
          )
        );
      } else {
        // Mode global : Vérifier que chaque mot existe dans AU MOINS UNE colonne
        table.setGlobalFilter((row: Row<T>) => {
          const rowValues = Object.values(row.original)
            .join(" ")
            .toLowerCase();
          return searchWords.every((word) => rowValues.includes(word));
        });
      }
    },
    [accessorKeys, table]
  );

  // Debounce pour limiter les appels de filtrage pendant la saisie
  const debouncedFilter = useCallback(debounce(applyFilter, 300), [applyFilter]);

  // Gestion du changement de l'input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    debouncedFilter(searchValue);
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
