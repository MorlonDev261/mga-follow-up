"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { createCompany, updateCompany } from "@/actions";
import LogoUploader from "@components/Uploader";
import { cn } from "@/lib/utils";

type Logo = { url: string; public_id: string };

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
  const { data: session } = useSession();

  const [company, setCompany] = useState<Company>({
    owner: initialData?.owner || session?.user?.id || "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (logo: Logo) => {
    setCompany((prev) => ({ ...prev, logo }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "create") {
        const newCompany = await createCompany(company);

        // Associer automatiquement l'utilisateur à l'entreprise créée
        await createCompanyUser({
          companyId: newCompany.id,
          userId: session?.user?.id!,
          role: "OWNER",
        });
        
        router.push(`/companies/${newCompany.id}`);
      } else if (mode === "edit" && initialData?.id) {
        await updateCompany(initialData.id, company);
        router.push("/");
      } else {
        throw new Error("Aucune ID pour mise à jour");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la soumission.");
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
      <h2
        className={cn(
          "text-2xl font-bold mb-6 pb-2 border-b",
          mode === "create"
            ? "text-green-800 border-green-400"
            : "text-orange-800 border-orange-400"
        )}
      >
        {mode === "create" ? "Créer une entreprise" : "Modifier l'entreprise"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-6">
          <div className="w-1/3">
            <LogoUploader isPerso logo={company.logo} setLogo={handleLogoChange}>
              {({ logo, isLoading }) => (
                <div className="relative">
                  <Image
                    src={logo.url || "/assets/add-company.png"}
                    alt="Logo"
                    width={90}
                    height={80}
                    className={cn(
                      "rounded w-full h-full border object-cover",
                      isLoading && "opacity-50"
                    )}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              )}
            </LogoUploader>
          </div>

          <div className="w-2/3 space-y-4">
            {["name", "contact", "address"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  {field === "name"
                    ? "Nom de l'entreprise"
                    : field === "contact"
                    ? "Contact Joignable"
                    : "Adresse de l’entreprise"}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={(company as any)[field]}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none"
                  placeholder={`Entrez ${field}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "nif", label: "NIF", placeholder: "Numéro d'identification fiscale" },
            { id: "stat", label: "STAT", placeholder: "Numéro statistique" },
          ].map(({ id, label, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-500 mb-1">
                {label}
              </label>
              <input
                type="text"
                id={id}
                name={id}
                value={(company as any)[id]}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-foreground rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>

        <div>
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
            className="w-full px-4 py-2 bg-background border border-foreground rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
            placeholder="Décrivez l'entreprise en quelques mots..."
          />
        </div>

        <div className="pt-4 border-t border-gray-200 mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "px-5 py-2 rounded-lg text-white font-medium",
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 active:bg-green-700"
            )}
          >
            {loading ? "Chargement..." : mode === "create" ? "Créer" : "Mettre à jour"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
