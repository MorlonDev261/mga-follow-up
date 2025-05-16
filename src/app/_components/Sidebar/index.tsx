"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import ProfileAvatar from "@components/ProfileAvatar";
import DialogPopup from "@components/DialogPopup";
import PageSwitcherDemo from "@components/SwitchCompany";
import Download from "@components/Download";

import { getCompaniesByUser } from "@/actions";
import { Prisma } from "@prisma/client";

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type Company = {
  id: string;
  name: string;
  createdAt: Date;
  desc: string;
  nif: string | null;
  stat: string | null;
  owner: string;
  contact: string;
  address: string;
  logo?: Prisma.JsonValue | null;
  userRole: string;
};

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Français");
  const [selectedCurrency, setSelectedCurrency] = useState("$");
  const [exchangeRate, setExchangeRate] = useState("");
  const [rounding, setRounding] = useState(false);

  const companySelected = companies.find(c => c.id === selectedCompany);

  // Récupère les entreprises de l'utilisateur
  useEffect(() => {
    async function fetchCompanies() {
      if (session?.user?.id) {
        const res = await getCompaniesByUser(session.user.id);
        setCompanies(res);
      }
    }
    fetchCompanies();
  }, [session?.user?.id]);

  // Initialise l'entreprise sélectionnée
  useEffect(() => {
    if (session?.selectedCompany) {
      setSelectedCompany(session.selectedCompany as string);
    } else {
      const local = localStorage.getItem("selectedCompany");
      if (local) setSelectedCompany(local);
    }
  }, [session?.selectedCompany]);

  // Mise à jour de la session et navigation
  useEffect(() => {
    if (
      selectedCompany &&
      selectedCompany !== session?.selectedCompany
    ) {
      const applyCompanySelection = async () => {
        setDialogOpen(true);
        await update({ selectedCompany });
        localStorage.setItem("selectedCompany", selectedCompany);
        router.replace("/");
        setDialogOpen(false);
      };
      applyCompanySelection();
    }
  }, [selectedCompany, session?.selectedCompany]);

  // Langue, monnaie, cours, arrondi
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    const savedCurrency = localStorage.getItem("currency");
    const savedRate = localStorage.getItem("rate");
    const savedRounding = localStorage.getItem("rounding");

    if (savedLang) setSelectedLanguage(savedLang);
    if (savedCurrency) setSelectedCurrency(savedCurrency);
    if (savedRate) setExchangeRate(savedRate);
    if (savedRounding) setRounding(savedRounding === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem("currency", selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    localStorage.setItem("rate", exchangeRate);
  }, [exchangeRate]);

  useEffect(() => {
    localStorage.setItem("rounding", rounding.toString());
  }, [rounding]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-80 flex flex-col justify-between overflow-x-auto">
        {session?.user ? (
          <div>
            <ProfileAvatar />
            <Separator className="my-4" />

            {/* Switch entreprise */}
            <div className="space-y-4">
              <Label>Switch company</Label>
              {companies.length > 0 ? (
                <Select
                  value={selectedCompany ?? ""}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Button onClick={() => router.push("/new-company")}>
                  Créer une entreprise
                </Button>
              )}
            </div>

            {/* Modal de changement d’entreprise */}
            <DialogPopup
              noStyled
              className="rounded-md"
              isOpen={dialogOpen}
              title="Changer d’entreprise"
            >
              {companySelected && (
                <PageSwitcherDemo
                  onSwich
                  userName={companySelected.name}
                  profilePicture={
                    typeof companySelected.logo === "object" && companySelected.logo !== null
                      ? (companySelected.logo as { url?: string })?.url ?? ""
                      : ""
                  }
                />
              )}
            </DialogPopup>

            {/* Paramètres */}
            <div className="space-y-4 mt-6">
              <div>
                <Label>Langue</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Malagasy">Malagasy</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="Anglais">Anglais</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Concurrence</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">Dollars ($)</SelectItem>
                    <SelectItem value="€">Euros (€)</SelectItem>
                    <SelectItem value="Dirham">Dirham (Dubai)</SelectItem>
                    <SelectItem value="Ar">Ariary (Ar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Cours</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Définir le cours</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-4">
                    <Label htmlFor="rate">Taux de change</Label>
                    <Input
                      id="rate"
                      type="number"
                      placeholder="Entrer le taux"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(e.target.value)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between">
                <Label>Arrondissement de valeur</Label>
                <Switch checked={rounding} onCheckedChange={setRounding} />
              </div>

              <Download />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center text-muted-foreground mb-4">
              Vous n&apos;êtes pas connecté
            </p>
            <Button onClick={() => router.push("/sign-in")}>
              Se connecter
            </Button>
          </div>
        )}

        {session?.user && (
          <Button
            variant="destructive"
            className="mt-6 w-full"
            onClick={() => signOut()}
          >
            Déconnexion
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
}
