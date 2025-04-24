"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input'

interface ComboboxProps {
  frameworks: { value: string; label: string }[]
  showSearch?: boolean
  closeOnSelect?: boolean
}

export default function Combobox({
  frameworks,
  showSearch = true,
  closeOnSelect = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [isAddProductFocus, setIsAddProductFocus] = React.useState(false)
  const [newProducts, setNewProducts] = React.useState<string[]>([]);
  
  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue)
    if (closeOnSelect) {
      setOpen(false)
    }
  }

  // Fonction d’ajout de produit
  const addNewProductField = () => {
    setNewProducts(prev => [...prev, '']);
  };

  // Mise à jour du nom du produit ajouté
  const updateNewProductName = (index: number, value: string) => {
    setNewProducts(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Sauvegarde d’un nouveau produit
  const saveNewProduct = async (index: number) => {
    const name = newProducts[index];
    if (!name) return;

    try {
      const response = await fetch('/api/company/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, companyId: 'your-company-id' }), // Dynamise `companyId` selon l'entreprise de l'utilisateur
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      setForm(prev => ({
        ...prev,
        idProduct: data.id,
      }));

      setNewProducts(prev => prev.filter((_, idx) => idx !== index)); // Utilisation de `filter` pour plus de sécurité
    } catch (err) {
      alert("Erreur lors de l'ajout du produit.");
    }
  };

  // Sélection d’un produit existant
  const handleProductSelect = (value: string) => {
    setForm(prev => ({ ...prev, idProduct: value }));
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
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {showSearch && <CommandInput placeholder="Search framework..." />}
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={() => handleSelect(framework.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <Select value={form.idProduct} onValueChange={handleProductSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez le produit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="flex justify-between items-center">
                  <span>Produits</span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowAddProduct(true);
                      addNewProductField();
                    }}
                   >
                     <PlusIcon className="w-4 h-4" />
                   </Button>
                 </SelectLabel>

                 {/* Si on veut ajouter un produit, masquons la liste */}
                 {!showAddProduct && (
                   <div className="space-y-1">
                     {['apple', 'banana', 'blueberry', 'grapes', 'pineapple'].map((prod) => (
                       <SelectItem key={prod} value={prod}>{prod}</SelectItem>
                     ))}
                   </div>
                 )}

                 {showAddProduct && newProducts.map((name, index) => (
                   <div key={index} className="flex gap-1 items-center px-2 py-1">
                     <Input
                       placeholder="Nouveau produit"
                       value={name}
                       onChange={(e) => updateNewProductName(index, e.target.value)}
                       className="flex-1"
                       onFocus={() => setIsAddProductFocus(true)} // Lorsqu'on entre dans le champ d'ajout
                       onBlur={() => setIsAddProductFocus(false)}  // Lorsqu'on quitte le champ d'ajout
                     />
                     <Button type="button" size="sm" onClick={() => saveNewProduct(index)}>
                       Ajouter
                     </Button>
                   </div>
                 ))}
               </SelectGroup>
             </SelectContent>
          </Select>
        
      </PopoverContent>
    </Popover>
  )
}
