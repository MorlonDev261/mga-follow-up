'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, PlusIcon, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ProductFormProps {
  setOpen: () => void;
}

export interface ProductFormData {
  arrival: number;
  stockDate: number;
  idProduct: string;
  qty: number;
  identifiers: { id: number; comment: string }[];
}

export default function ProductForm({ setOpen }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({
    arrival: Date.now(),
    stockDate: Date.now(),
    idProduct: '',
    qty: 0,
    identifiers: [],
  });

  const [newProducts, setNewProducts] = useState<string[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddProductFocus, setIsAddProductFocus] = useState(false); // Ajout de l'état pour focus

  // Fonction pour gérer la modification de la quantité
  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = Number(e.target.value);
    setForm(prev => ({
      ...prev,
      qty,
      identifiers: prev.identifiers.slice(0, qty),
    }));
  };

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

  // Gestion de la modification des dates
  const handleDateChange = (key: 'arrival' | 'stockDate', date: Date | undefined) => {
    if (!date) return;
    setForm(prev => ({
      ...prev,
      [key]: date.getTime(),
    }));
  };

  // Modification des identifiants
  const handleIdentifierChange = (index: number, field: 'id' | 'comment', value: string) => {
    setForm(prev => {
      const updated = [...prev.identifiers];
      updated[index] = { ...updated[index], [field]: field === 'id' ? Number(value) : value };
      return { ...prev, identifiers: updated };
    });
  };

  // Ajout d’un identifiant
  const addIdentifier = () => {
    if (form.identifiers.length < form.qty) {
      setForm(prev => ({
        ...prev,
        identifiers: [...prev.identifiers, { id: 0, comment: '' }],
      }));
    }
  };

  // Suppression d’un identifiant
  const removeIdentifier = (index: number) => {
    setForm(prev => {
      const updated = [...prev.identifiers];
      updated.splice(index, 1);
      return { ...prev, identifiers: updated };
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.identifiers.length !== form.qty) {
      alert(`Le nombre d'identifiants (${form.identifiers.length}) doit être égal à la quantité (${form.qty}).`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Échec de l’enregistrement');
      alert('Produit enregistré avec succès !');
      setOpen();
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue lors de l’enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-2">
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        {['arrival', 'stockDate'].map((key) => (
          <div key={key}>
            <label className="block mb-1 text-sm font-medium">
              {key === 'arrival' ? 'Date d’arrivée' : 'Date du stock'}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left", !form[key as 'arrival' | 'stockDate'] && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form[key as 'arrival' | 'stockDate']
                    ? format(form[key as 'arrival' | 'stockDate'], 'PPP')
                    : 'Choisir une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={new Date(form[key as 'arrival' | 'stockDate'])}
                  onSelect={(date) => handleDateChange(key as 'arrival' | 'stockDate', date)}
                />
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 items-end">
        <div className="col-span-2 md:col-span-3">
          <label className="block mb-1 text-sm font-medium">Nom du produit</label>
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
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Quantité</label>
          <Input
            type="number"
            name="qty"
            value={form.qty}
            onChange={handleQtyChange}
            min={0}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Identifiants & Commentaires</label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              if (form.qty === 0) {
                alert("Veuillez d'abord entrer une quantité.");
                return;
              }
              if (form.identifiers.length >= form.qty) {
                alert(`Vous avez déjà ajouté ${form.qty} identifiant(s).`);
                return;
              }
              addIdentifier(); 
            }}
          >
            <PlusIcon className="w-4 h-4 mr-1" /> Ajouter
          </Button>
        </div>

        {form.identifiers.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
            <Input
              type="number"
              placeholder="Identifiant"
              value={item.id}
              onChange={(e) => handleIdentifierChange(index, 'id', e.target.value)}
              required
              className="col-span-2"
            />
            <Input
              type="text"
              placeholder="Commentaire"
              value={item.comment}
              onChange={(e) => handleIdentifierChange(index, 'comment', e.target.value)}
              required
              className="col-span-2"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => removeIdentifier(index)}
              className="text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="submit" className="mt-4 w-full" disabled={loading}>
        {loading ? 'Enregistrement...' : 'Enregistrer le produit'}
      </Button>
    </form>
  );
}
