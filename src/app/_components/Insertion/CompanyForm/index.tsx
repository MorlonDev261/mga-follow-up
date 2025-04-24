import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { createCompany, updateCompany } from "@/actions";

// Définition du type entreprise (vous pouvez l'ajuster selon les champs de votre modèle)
interface Company {
  id?: string;
  name: string;
  nif?: string;
  stat?: string;
  desc: string;
}

// Props du composant. En mode "edit", on attend un objet initialData pour préremplir le formulaire.
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestion des changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "create") {
        // Appel à la fonction de création d'entreprise
        const newCompany = await createCompany(company);
        router.push(`/companies/${newCompany.id}`); // Redirection vers la page de détails par exemple
      } else if (mode === "edit") {
        if (!initialData?.id) throw new Error("L'identifiant de l'entreprise est manquant");
        const updatedCompany = await updateCompany(initialData.id, company);
        router.push(`/companies/${updatedCompany.id}`);
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'opération.");
      console.error("Erreur lors de la soumission", err);
    } finally {
      setLoading(false);
    }
  };

  // Affichage d'un loader ou d'un message si la session n'est pas encore récupérée
  if (!session) {
    return <div>Chargement de la session...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{mode === "create" ? "Créer une entreprise" : "Modifier l'entreprise"}</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}

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
          ? "Créer l&apos;entreprise"
          : "Mettre à jour l&apos;entreprise"}
      </button>
    </form>
  );
};

export default CompanyForm;
