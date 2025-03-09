import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

type TableFilterProps<T> = {
  table: Table<T>;
  accessorKeys?: string[]; // Colonnes spécifiques à filtrer (optionnel)
  placeholder?: string;
  className?: string;
};

export default function TableFilter<T>({
  table,
  accessorKeys,
  placeholder = "Search...",
  className = "max-w-sm",
}: TableFilterProps<T>) {
  return (
    <Input
      placeholder={placeholder}
      onChange={(event) => {
        const searchValue = event.target.value.trim().toLowerCase();
        const searchWords = searchValue.split(/\s+/); // Découper par espace

        if (accessorKeys) {
          // 🎯 Mode multi-colonnes : applique un filtre sur plusieurs colonnes
          table.setColumnFilters(
            accessorKeys.map((key) => ({
              id: key,
              value: searchWords, // Stocker un tableau de mots
            }))
          );
        } else {
          // 🔍 Mode global : vérifier que tous les mots existent dans AU MOINS UNE colonne
          table.setGlobalFilter((row) => {
            const rowValues = Object.values(row.original) // Récupérer toutes les valeurs
              .join(" ") // Les concaténer en une seule string
              .toLowerCase(); // Passer en minuscule pour une recherche insensible à la casse

            return searchWords.every((word) => rowValues.includes(word));
          });
        }
      }}
      className={className}
    />
  );
}
