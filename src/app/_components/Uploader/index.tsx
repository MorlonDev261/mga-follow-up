'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type Logo = {
  url: string;
  public_id: string;
};

type Props = {
  logo: Logo | null;
  setLogo: (logo: Logo | null) => void;
};

export default function LogoUploader({ logo, setLogo }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setLogo({ url: data.secure_url, public_id: data.public_id });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload du logo.");
    }
  };

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">Logo de l’entreprise</label>

      {logo ? (
        <div className="flex items-center gap-4">
          <Image
            src={logo.url}
            alt="Logo"
            width={80}
            height={80}
            className="rounded border object-contain"
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setLogo(null)}>
              Supprimer
            </Button>
            <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
              Changer
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
          Télécharger un logo
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}
