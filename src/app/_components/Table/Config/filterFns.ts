import { FilterFn } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const multiWordGlobalFilter: FilterFn<any> = (row, columnIds, filterValue) => {
  const { search, accessorKeys } = filterValue || { search: "", accessorKeys: [] };

  if (!search) return true;

  // Séparer la recherche en mots
  const words = search.split(" ").filter(Boolean);

  // Pour chaque mot, vérifier qu’il est trouvé dans au moins une des colonnes sélectionnées.
  return words.every((word: string) =>
    accessorKeys.some((key: string) => {
      const cellValue = row.getValue(key);
      return cellValue && String(cellValue).toLowerCase().includes(word.toLowerCase());
    })
  );
};
