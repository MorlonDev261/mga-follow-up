"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import du router
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

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { data: session } = useSession(); // Récupération de la session
  const router = useRouter(); // Initialisation du router
  const [selectedLanguage, setSelectedLanguage] = useState("Français");
  const [selectedCurrency, setSelectedCurrency] = useState("$");
  const [exchangeRate, setExchangeRate] = useState("");
  const [rounding, setRounding] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-80 flex overflow-x-auto flex-col justify-between">
        {session?.user ? (
          <div>
            {/* Profil */}
            <ProfileAvatar auth={true} />

            <Separator className="my-4" />

            {/* Paramètres */}
            <div className="space-y-4">
              {/* Langue */}
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

              {/* Concurrence */}
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

              {/* Cours */}
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

              {/* Arrondissement */}
              <div className="flex items-center justify-between">
                <Label>Arrondissement de valeur</Label>
                <Switch checked={rounding} onCheckedChange={setRounding} />
              </div>

              {/* Télécharger l'app */}
              <Download />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center text-gray-500 mb-4">Vous n&apos;êtes pas connecté</p>
            <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => router.push("/auth/sign-in")}>
              Se connecter
            </Button>
          </div>
        )}

        {/* Bouton Déconnexion */}
        {session?.user && (
          <Button variant="destructive" className="mt-6 w-full" onClick={() => signOut()}>
            Déconnexion
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
}
