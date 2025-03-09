import { Table, Row } from "@tanstack/react-table";
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
        const searchWords = searchValue.split(/\s+/); // Séparer par espaces

        if (accessorKeys) {
          // 🎯 Mode multi-colonnes : Filtrer chaque colonne pour qu'elle contienne au moins un des mots
          table.setColumnFilters(
            accessorKeys.flatMap((key) =>
              searchWords.map((word) => ({
                id: key,
                value: word, // Chaque mot doit être pris individuellement pour chaque colonne
              }))
            )
          );
        } else {
          // 🔍 Mode global : Vérifier que chaque mot existe dans AU MOINS UNE colonne
          table.setGlobalFilter((row: Row<T>) => {
            const rowValues = Object.values(row.original as Record<string, any>) // ✅ Cast en objet exploitable
              .join(" ") // Concaténer les valeurs
              .toLowerCase(); // Passer en minuscule

            return searchWords.every((word) => rowValues.includes(word));
          });
        }
      }}
      className={className}
    />
  );
}
