'use client';

import { useRef, ReactNode, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file) return;
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Gestion du drag & drop
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Vérifier si le fichier est une image
      if (file.type.match('image.*')) {
        handleUpload(file);
      } else {
        alert('Veuillez déposer uniquement des fichiers image.');
      }
    }
  };

  // Rendu conditionnel des enfants avec l'état de chargement et de glisser-déposer
  const renderChildren = () => {
    if (typeof children === 'function') {
      return children({ logo, isLoading, isDragging });
    }
    return children;
  };

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">Logo de l'entreprise</label>
      
      <div 
        onClick={handleClick}
        className={`cursor-pointer relative inline-block ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[80px] min-w-[80px] bg-gray-100 rounded border">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          isPerso ? (
            renderChildren()
          ) : (
            logo.url ? (
              <div className={`relative group ${isDragging ? 'opacity-60' : ''}`}>
                <Image
                  src={logo.url}
                  alt="Logo"
                  width={80}
                  height={80}
                  className="rounded border object-contain transition-opacity group-hover:opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-black bg-opacity-50 text-white text-xs p-1 rounded">
                    {isDragging ? 'Déposer ici' : 'Modifier'}
                  </span>
                </div>
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center h-20 w-20 border-2 border-dashed 
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} 
                rounded transition-colors`}>
                {renderChildren() || (
                  <>
                    <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xs text-gray-500">
                      {isDragging ? 'Déposer ici' : 'Cliquer ou glisser'}
                    </span>
                  </>
                )}
              </div>
            )
          )
        )}
        
        {isDragging && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-20 z-10 pointer-events-none"></div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
