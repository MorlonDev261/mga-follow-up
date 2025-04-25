"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createCompany, updateCompany } from "@/actions";
import LogoUploader from "@components/Uploader";

type Logo = {
  url: string;
  public_id: string;
};

interface Company {
  id?: string;
  name: string;
  nif?: string;
  stat?: string;
  desc: string;
  logo: Logo | null;
}

interface CompanyFormProps {
  mode: "create" | "edit";
  initialData?: Company;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ mode, initialData }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [company, setCompany] = useState<Company>({
    name: initialData?.name || "",
    nif: initialData?.nif || "",
    stat: initialData?.stat || "",
    desc: initialData?.desc || "",
    logo: initialData?.logo || null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        const newCompany = await createCompany(company);
        router.push(`/companies/${newCompany.id}`);
      } else if (mode === "edit") {
        if (!initialData?.id) throw new Error("ID manquant pour la modification.");
        const updated = await updateCompany(initialData.id, company);
        router.push(`/companies/${updated.id}`);
      }
    } catch (err) {
      setError("Une erreur est survenue.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div>Chargement de la session...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">
        {mode === "create" ? "Créer une entreprise" : "Modifier l'entreprise"}
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <LogoUploader
        logo={company.logo}
        setLogo={(newLogo) => setCompany((prev) => ({ ...prev, logo: newLogo }))}
      />

      <div>
        <label htmlFor="name">Nom :</label>
        <input
          type="text"
          id="name"
          name="name"
          value={company.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="nif">NIF :</label>
        <input
          type="text"
          id="nif"
          name="nif"
          value={company.nif}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="stat">STAT :</label>
        <input
          type="text"
          id="stat"
          name="stat"
          value={company.stat}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="desc">Description :</label>
        <textarea
          id="desc"
          name="desc"
          value={company.desc}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading
          ? "En cours..."
          : mode === "create"
          ? "Créer l'entreprise"
          : "Mettre à jour l'entreprise"}
      </button>
    </form>
  );
};

export default CompanyForm;
