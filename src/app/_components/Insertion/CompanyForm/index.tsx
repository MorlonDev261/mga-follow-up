"use client";

import React, { useState, useEffect, FormEvent } from "react";
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
  const session = useSession();
  const [company, setCompany] = useState<Company>({
    name: initialData?.name || "",
    nif: initialData?.nif || "",
    stat: initialData?.stat || "",
    desc: initialData?.desc || "",
    logo: initialData?.logo || null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logo, setLogo] = useState<Logo>(initialData?.logo || { url: "", public_id: "" });

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
      if (mode === "create") {
        const newCompany = await createCompany(dataToSubmit);
        router.push(`/companies/${newCompany.id}`);
      } else if (mode === "edit") {
        if (!initialData?.id) throw new Error("L'identifiant de l'entreprise est manquant");
        const updatedCompany = await updateCompany(initialData.id, dataToSubmit);
        router.push(`/companies/${updatedCompany.id}`);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'opération.");
      console.error("Erreur lors de la soumission", err);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <div>Chargement de la session...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{mode === "create" ? "Créer une entreprise" : "Modifier l'entreprise"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <LogoUploader logo={logo} setLogo={setLogo} />

      <div>
        <label htmlFor="name">Nom de l&apos;entreprise :</label>
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
