'use client';

import { useState } from 'react';
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'arrival' || name === 'stockDate' || name === 'qty' || name === 'id'
        ? Number(value)
        : value,
    }));
  };

  const handleProductSelect = (value: string) => {
    setForm(prev => ({ ...prev, idProduct: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
          <label className="block mb-1 font-medium">Arrivée</label>
          <input
            type="number"
            name="arrival"
            value={form.arrival}
            onChange={handleChange}
            min={0}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Date stock</label>
          <input
            type="number"
            name="stockDate"
            value={form.stockDate}
            onChange={handleChange}
            min={0}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className="block mb-1 font-medium">Nom du produit</label>
          <Select
            value={form.idProduct}
            onValueChange={handleProductSelect}
          >
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
          <label className="block mb-1 font-medium">Quantité</label>
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
          <label className="block mb-1 font-medium">Identifiant (ex: IMEI)</label>
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
          <label className="block mb-1 font-medium">Commentaire</label>
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
