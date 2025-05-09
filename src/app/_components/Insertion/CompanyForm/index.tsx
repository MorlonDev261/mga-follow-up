"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCompany, createCompanyUser, updateCompany } from "@/actions";
import LogoUploader from "@components/Uploader";
import { cn } from "@/lib/utils";

// === ZOD SCHEMA ===
const companySchema = z.object({
  name: z.string().min(1, "Nom requis"),
  contact: z.string().min(1, "Contact requis"),
  address: z.string().min(1, "Adresse requise"),
  nif: z.string().optional(),
  stat: z.string().optional(),
  desc: z.string().min(1, "Description requise"),
  logo: z.object({
    url: z.string(),
    public_id: z.string(),
  }),
  owner: z.string().min(1),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface Logo {
  url: string;
  public_id: string;
}

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
  const [logo, setLogo] = useState<Logo>(initialData?.logo || { url: "", public_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: initialData?.name || "",
      nif: initialData?.nif || "",
      stat: initialData?.stat || "",
      contact: initialData?.contact || "",
      desc: initialData?.desc || "",
      address: initialData?.address || "",
      logo: initialData?.logo || { url: "", public_id: "" },
      owner: initialData?.owner || session?.user?.id || "",
    },
  });

  // Mise à jour du logo dans le formulaire
  useEffect(() => {
    setValue("logo", logo);
  }, [logo, setValue]);

  const onSubmit = async (data: CompanyFormData) => {
    setLoading(true);
    setError(null);
    try {
      if (mode === "create") {
        const newCompany = await createCompany(data);

        if (!session?.user?.id) {
          throw new Error("L'utilisateur n'est pas authentifié.");
        }

        await createCompanyUser({
          companyId: newCompany.id,
          userId: session.user.id,
          role: "OWNER",
        });

        router.push(`/companies/${newCompany.id}`);
      } else if (mode === "edit") {
        if (!initialData?.id) throw new Error("ID manquant");
        await updateCompany(initialData.id, data);
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
      <h2
        className={cn(
          "text-2xl font-bold mb-6 pb-2 border-b",
          mode === "create" ? "text-green-800 border-green-400" : "text-orange-800 border-orange-400"
        )}
      >
        {mode === "create" ? "Créer une entreprise" : "Modifier l'entreprise"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-2 md:gap-6">
          <div className="w-1/3 flex flex-col items-center">
            <LogoUploader isPerso logo={logo} setLogo={setLogo}>
              {(props) => (
                <div className="relative">
                  <Image
                    src={props.logo.url || "/assets/add-company.png"}
                    alt="Logo"
                    width={90}
                    height={80}
                    className={cn(
                      "rounded w-full h-full border object-cover",
                      props.isLoading && "opacity-50"
                    )}
                  />
                  {props.isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-t-2 border-b-2 border-green-500 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </LogoUploader>
          </div>

          <div className="w-2/3 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nom</label>
              <input
                {...register("name")}
                placeholder="Nom de l'entreprise"
                className="w-full p-2 bg-transparent border-b border-gray-300 focus:border-green-500"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Contact</label>
              <input
                {...register("contact")}
                placeholder="Contact"
                className="w-full p-2 bg-transparent border-b border-gray-300 focus:border-green-500"
              />
              {errors.contact && <p className="text-sm text-red-500">{errors.contact.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Adresse</label>
              <input
                {...register("address")}
                placeholder="Adresse"
                className="w-full p-2 bg-transparent border-b border-gray-300 focus:border-green-500"
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">NIF</label>
            <input
              {...register("nif")}
              placeholder="NIF"
              className="w-full px-4 py-2 bg-background border border-foreground rounded-lg focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">STAT</label>
            <input
              {...register("stat")}
              placeholder="STAT"
              className="w-full px-4 py-2 bg-background border border-foreground rounded-lg focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Description</label>
          <textarea
            {...register("desc")}
            rows={4}
            placeholder="Décrivez l'entreprise..."
            className="w-full px-4 py-2 bg-background border border-foreground rounded-lg resize-none focus:ring-green-500"
          />
          {errors.desc && <p className="text-sm text-red-500">{errors.desc.message}</p>}
        </div>

        <div className="pt-4 border-t border-gray-200 mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 mr-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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
            {loading ? "Enregistrement..." : mode === "create" ? "Créer" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
