'use client';

import { useState } from 'react';

interface EmployerFormProps {
  setOpen: () => void;
}

export interface EmployerFormData {
  fullname: string;
  position: string;
  email: string;
  phone: string;
  department: string;
}

export default function EmployerForm({ setOpen }: EmployerFormProps) {
  const [form, setForm] = useState<EmployerFormData>({
    fullname: '',
    position: '',
    email: '',
    phone: '',
    department: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/employers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Échec de l’enregistrement');
      }

      alert('Employé enregistré avec succès !');
      setOpen();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-sm py-2">
      <div>
        <label className="block mb-1 font-medium">Nom complet</label>
        <input
          type="text"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Poste</label>
        <input
          type="text"
          name="position"
          value={form.position}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Département</label>
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Sélectionnez un département</option>
          <option value="RH">Ressources humaines</option>
          <option value="Informatique">Informatique</option>
          <option value="Marketing">Marketing</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn-primary mt-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Enregistrement...' : 'Enregistrer l’employé'}
      </button>
    </form>
  );
}
