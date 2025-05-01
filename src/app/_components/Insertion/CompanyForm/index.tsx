"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { createCompany, updateCompany } from "@/actions";
import LogoUploader from "@components/Uploader";
import { cn } from "@/lib/utils";

type Logo = {
  url: string;
  public_id: string;
};

interface Company {
  id?: string;
  name: string;
  nif?: string;
  stat?: string;
  contact: string;
  desc: string;
  logo: Logo;
  owner: string;
  address: string;
}

interface CompanyFormProps {
  mode: "create" | "edit";
  initialData?: Company;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ mode, initialData }) => {
  const router = useRouter();
  const session = useSession();
  const [company, setCompany] = useState<Company>({
    owner: (initialData?.owner || session.data?.user?.id) ?? "",
    name: initialData?.name || "",
    nif: initialData?.nif || "",
    stat: initialData?.stat || "",
    contact: initialData?.contact || "",
    desc: initialData?.desc || "",
    address: initialData?.address || "",
    logo: initialData?.logo || { url: "", public_id: "" },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logo, setLogo] = useState<Logo>(initialData?.logo || { url: "", public_id: "" });

  useEffect(() => {
    setCompany((prev) => ({
      ...prev,
      logo: logo,
    }));
  }, [logo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const dataToSubmit = { ...company, logo };
      alert(JSON.stringify(dataToSubmit));
      if (mode === "create") {
        const newCompany = await createCompany(dataToSubmit);
        router.push(`/companies/${newCompany.id}`);
      } else if (mode === "edit") {
        if (!initialData?.id) throw new Error("L'identifiant de l'entreprise est manquant");
        const updatedCompany = await updateCompany(initialData.id, dataToSubmit);
        router.push("/");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'opération.");
      console.error("Erreur lors de la soumission", err);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
      <h2 className={cn("text-2xl font-bold mb-6 pb-2 border-b", mode === "create" ? "text-green-800 border-green-400" : "text-orange-800 border-orange-400")}>
        {mode === "create" ? "Créer une entreprise" : "Modifier l&apos;entreprise"}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap:2 md:gap-6">
          {/* Logo section (left side) */}
          <div className="w-1/3">
            <div className="flex flex-col items-center">
              <LogoUploader 
                isPerso 
                logo={logo} 
                setLogo={setLogo}
               >
                 {(props) => (
                   <div className="relative">
                     {props.logo.url ? (
                       <Image
                         src={props.logo.url}
                         alt="Logo"
                         width={90}
                         height={80}
                         className={`rounded w-full h-full border object-cover ${props.isLoading ? 'opacity-50' : ''}`}
                       />
                      ) : (
                        <Image
                          src="/assets/add-company.png"
                          alt="Ajouter un logo"
                          width={90}
                          height={80}
                          className={`rounded border object-cover ${props.isLoading ? 'opacity-50' : ''}`}
                        />
                      )}
                      {props.isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  )}
                </LogoUploader>
             </div>
          </div>
          
          {/* Form fields (right side) */}
          <div className="w-2/3">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-1">
                Nom de l&apos;entreprise
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={company.name}
                onChange={handleChange}
                required
                className="w-full p-2 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 hover:border-green-400 focus:outline-none focus:ring-0 transition-colors"
                placeholder="Entrez le nom de l'entreprise"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="contact" className="block text-sm font-medium text-gray-500 mb-1">
                Contact Joignable
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={company.contact}
                onChange={handleChange}
                required
                className="w-full p-2 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 hover:border-green-400 focus:outline-none focus:ring-0 transition-colors"
                placeholder="Entrez le contact de l'entreprise"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-500 mb-1">
                Adresse de l’entreprise
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={company.address}
                onChange={handleChange}
                required
                className="w-full p-2 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 hover:border-green-400 focus:outline-none focus:ring-0 transition-colors"
                placeholder="Entrez l’adresse de l'entreprise"
              />
            </div>
          </div>
        </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nif" className="block text-sm font-medium text-gray-500 mb-1">
                  NIF
                </label>
                <input
                  type="text"
                  id="nif"
                  name="nif"
                  value={company.nif}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Numéro d'identification fiscale"
                />
              </div>
              
              <div>
                <label htmlFor="stat" className="block text-sm font-medium text-gray-500 mb-1">
                  STAT
                </label>
                <input
                  type="text"
                  id="stat"
                  name="stat"
                  value={company.stat}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Numéro statistique"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="desc" className="block text-sm font-medium text-gray-500 mb-1">
                Description
              </label>
              <textarea
                id="desc"
                name="desc"
                value={company.desc}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-background border border-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                placeholder="Décrivez l'entreprise en quelques mots..."
              />
            </div>
          
        
        <div className="pt-4 border-t border-gray-200 mt-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 mr-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-green-500 hover:bg-green-600 active:bg-green-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  En cours...
                </span>
              ) : (
                mode === "create" ? "Créer l'entreprise" : "Mettre à jour l'entreprise"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
