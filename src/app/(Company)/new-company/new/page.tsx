'use client';

import { useState, useEffect } from 'react';
import LogoUploader from '@components/Uploader';
import { Button } from '@/components/ui/button';

type Logo = {
  url: string;
  public_id: string;
};

export default function CompanyForm() {
  const [logo, setLogo] = useState<Logo>({ url: '', public_id: '' });

  useEffect(() => {
    alert(JSON.stringify(logo, null, 2));
  }, [logo]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Nom de l’entreprise', // Tu peux ajouter un champ de texte pour modifier ça
          logo,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      alert('Entreprise créée avec succès !');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l'entreprise.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-md mx-auto mt-8">
      <LogoUploader logo={logo} setLogo={setLogo} />
      
      <Button type="submit" disabled={!logo.url}>
        Enregistrer l’entreprise
      </Button>
    </form>
  );
}
