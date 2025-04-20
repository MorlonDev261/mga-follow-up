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

  const [loading, setLoading] = useState(false);

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = Number(e.target.value);
    setForm(prev => ({
      ...prev,
      qty,
      identifiers: prev.identifiers.slice(0, qty),
    }));
  };

  const handleProductSelect = (value: string) => {
    setForm(prev => ({ ...prev, idProduct: value }));
  };

  const handleDateChange = (key: 'arrival' | 'stockDate', date: Date | undefined) => {
    if (!date) return;
    setForm(prev => ({
      ...prev,
      [key]: date.getTime(),
    }));
  };

  const handleIdentifierChange = (index: number, field: 'id' | 'comment', value: string) => {
    setForm(prev => {
      const updated = [...prev.identifiers];
      updated[index] = { ...updated[index], [field]: field === 'id' ? Number(value) : value };
      return { ...prev, identifiers: updated };
    });
  };

  const addIdentifier = () => {
    if (form.identifiers.length < form.qty) {
      setForm(prev => ({
        ...prev,
        identifiers: [...prev.identifiers, { id: 0, comment: '' }],
      }));
    }
  };

  const removeIdentifier = (index: number) => {
    setForm(prev => {
      const updated = [...prev.identifiers];
      updated.splice(index, 1);
      return { ...prev, identifiers: updated };
    });
  };

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
      <div className="grid md:grid-cols-2 gap-4">
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
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
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
            }
          }>
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
