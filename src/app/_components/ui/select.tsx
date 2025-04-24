"use client";

import * as React from "react";
import { getProductsByCompany, createProduct } from "@/actions";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProductFormData {
  arrival: number;
  stockDate: number;
  idProduct: string;
  qty: number;
  identifiers: { id: number; comment: string }[];
}

interface ComboboxProps {
  form: ProductFormData;
  setForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  companyId: string;
  showSearch?: boolean;
  closeOnSelect?: boolean;
}

export default function Combobox({
  form,
  setForm,
  companyId,
  showSearch = true,
  closeOnSelect = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(form.idProduct || "");
  const [products, setProducts] = React.useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newProducts, setNewProducts] = React.useState<string[]>([]);
  const [showAddProduct, setShowAddProduct] = React.useState(false);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCompany(companyId);
        setProducts(data);
      } catch (err) {
        console.error("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [companyId]);

  React.useEffect(() => {
    setValue(form.idProduct || "");
  }, [form.idProduct]);

  const handleSelect = (id: string) => {
    const selected = id === value ? "" : id;
    setValue(selected);
    setForm((prev) => ({ ...prev, idProduct: selected }));
    if (closeOnSelect) setOpen(false);
  };

  const addNewProductField = () => {
    setShowAddProduct(true);
    setNewProducts((prev) => [...prev, ""]);
  };

  const updateNewProductName = (index: number, newName: string) => {
    setNewProducts((prev) => {
      const updated = [...prev];
      updated[index] = newName;
      return updated;
    });
  };

  const saveNewProduct = async (index: number) => {
    const name = newProducts[index];
    if (!name) return;

    try {
      const data = await createProduct({ name: name.trim(), companyId });

      setForm((prev) => ({ ...prev, idProduct: data.id }));
      setProducts((prev) => [...prev, { id: data.id, name: data.name }]);
      setNewProducts((prev) => prev.filter((_, i) => i !== index));
      setShowAddProduct(false);
    } catch (err) {
      alert("Erreur lors de l'ajout du produit.");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? products.find((p) => p.id === value)?.name
            : loading
            ? "Chargement..."
            : "Sélectionner un produit..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <div className="flex items-center justify-between px-2 pt-2 pb-1">
            <span className="text-sm font-medium">Produits</span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addNewProductField();
              }}
            >
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>

          {showSearch && <CommandInput placeholder="Rechercher un produit..." />}
          <CommandList>
            <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
            <CommandGroup>
              {!showAddProduct &&
                products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.id}
                    onSelect={() => handleSelect(product.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === product.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {product.name}
                  </CommandItem>
                ))}

              {showAddProduct &&
                newProducts.map((name, index) => (
                  <div key={index} className="flex gap-1 items-center px-2 py-1">
                    <Input
                      placeholder="Nouveau produit"
                      value={name}
                      onChange={(e) => updateNewProductName(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => saveNewProduct(index)}
                    >
                      Ajouter
                    </Button>
                  </div>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
