'use client';

import { useState } from 'react';
import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductFormProps {
  setOpen: () => void;
}

export interface ProductFormData {
  arrival: number;
  stockDate: number;
  idProduct: string;
  qty: number;
  id: number;
  comment: string;
}

export default function ProductForm({ setOpen }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({
    arrival: 0,
    stockDate: 0,
    idProduct: '',
    qty: 0,
    id: 0,
    comment: '',
  });
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>();
  const [stockDateDate, setStockDateDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['arrival', 'stockDate', 'qty', 'id'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleProductSelect = (value: string) => {
    setForm((prev) => ({ ...prev, idProduct: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedForm = {
      ...form,
      arrival: arrivalDate?.getTime() || 0,
      stockDate: stockDateDate?.getTime() || 0,
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedForm),
      });

      if (!response.ok) {
        throw new Error('Échec de l’enregistrement');
      }

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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Arrivée</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !arrivalDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {arrivalDate ? format(arrivalDate, 'PPP') : 'Choisir une date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={arrivalDate}
                onSelect={setArrivalDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Date stock</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !stockDateDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {stockDateDate
                  ? format(stockDateDate, 'PPP')
                  : 'Choisir une date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={stockDateDate}
                onSelect={setStockDateDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className="block mb-1 text-sm font-medium">Nom du produit</label>
          <Select value={form.idProduct} onValueChange={handleProductSelect}>
            <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2">
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
          <input
            type="number"
            name="qty"
            value={form.qty}
            onChange={handleChange}
            min={0}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Identifiant (ex: IMEI)
          </label>
          <input
            type="number"
            name="id"
            value={form.id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Commentaire</label>
          <input
            type="text"
            name="comment"
            value={form.comment}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary mt-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Enregistrement...' : 'Enregistrer le produit'}
      </button>
    </form>
  );
}
