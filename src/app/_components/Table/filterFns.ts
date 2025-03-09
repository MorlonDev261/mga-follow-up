import { FilterFn } from "@tanstack/react-table";

// Cette fonction reçoit la ligne, la liste des colonnes disponibles pour le filtrage
// et la valeur du filtre (ici un objet personnalisé).
export const multiWordGlobalFilter: FilterFn<any> = (row, columnIds, filterValue) => {
  const { search, accessorKeys } = filterValue || { search: "", accessorKeys: [] };

  if (!search) return true;

  // Séparer la recherche en mots
  const words = search.split(" ").filter(Boolean);

  // Pour chaque mot, vérifier qu’il est trouvé dans au moins une des colonnes sélectionnées.
  return words.every((word) =>
    accessorKeys.some((key) => {
      const cellValue = row.getValue(key);
      return cellValue && String(cellValue).toLowerCase().includes(word.toLowerCase());
    })
  );
};
