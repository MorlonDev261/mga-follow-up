"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import ProfileAvatar from "@components/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Download from "@components/Download";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getCompaniesByUser } from "@/actions";
import { Role, Prisma } from "@prisma/client";

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
  logo: Prisma.JsonValue | null;
  userRole: string;
}

type CompanyWithRole = Company & { userRole: Role };

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [companies, setCompanies] = useState<CompanyWithRole[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Français");
  const [selectedCurrency, setSelectedCurrency] = useState("$");
  const [exchangeRate, setExchangeRate] = useState("");
  const [rounding, setRounding] = useState(false);

  useEffect(() => {
    async function fetchCompanies() {
      if (session?.user?.id) {
        const res = await getCompaniesByUser(session.user.id);
        setCompanies(res);
        if (res.length > 0) setSelectedCompany(res[0].id); // sélection par défaut
      }
    }

    fetchCompanies();
  }, [session]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-80 flex overflow-x-auto flex-col justify-between">
        {session?.user ? (
          <div>
            <ProfileAvatar />
            <Separator className="my-4" />

            {/* Entreprises */}
            <div className="space-y-4">
              <Label>Switch company</Label>
              {companies.length > 0 ? (
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
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
                <Button onClick={() => router.push("/create-company")}>
                  Créer une entreprise
                </Button>
              )}
            </div>

            {/* Paramètres */}
            <div className="space-y-4 mt-4">
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
            <p className="text-center text-gray-500 mb-4">Vous n&apos;êtes pas connecté</p>
            <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => router.push("/sign-in")}>
              Se connecter
            </Button>
          </div>
        )}

        {session?.user && (
          <Button variant="destructive" className="mt-6 w-full" onClick={() => signOut()}>
            Déconnexion
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
}
