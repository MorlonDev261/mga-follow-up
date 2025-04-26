'use client';

import { useRef, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type Logo = {
  url: string;
  public_id: string;
};

type Props = {
  logo: Logo;
  setLogo: (logo: Logo) => void;
  children?: ReactNode;
  isPerso?: boolean;
};

export default function LogoUploader({ logo, setLogo, children, isPerso }: Props) {
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

      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      const data = await res.json();
      setLogo({ url: data.secure_url, public_id: data.public_id });

      // Réinitialiser l'input fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload du logo.");
    }
  };

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">Logo de l’entreprise</label>

      {logo.url !== "" ? (
        <div className="flex flex-col items-center gap-1">
          {isPerso ? (
            children
          ) : (
            <Image
              src={logo.url}
              alt="Logo"
              width={80}
              height={80}
              className="rounded border object-contain"
            />
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLogo({ url: "", public_id: "" })}
            >
              Supprimer
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Changer
            </Button>
          </div>
        </div>
      ) : (
        children ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer inline-block"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
              }
            }}
          >
            {children}
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Importer une photo
          </Button>
        )
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
