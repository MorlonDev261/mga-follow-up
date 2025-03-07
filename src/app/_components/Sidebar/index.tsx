"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FaPen } from "react-icons/fa";

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {

  const [fullname, setFullname] = useState("John Doe");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Français");
  const [selectedCurrency, setSelectedCurrency] = useState("$");
  const [exchangeRate, setExchangeRate] = useState("");
  const [rounding, setRounding] = useState(false);

  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
  };

  const saveFullname = () => {
    setIsEditing(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent className="w-80 flex flex-col justify-between">
        <div>
          {/* Profil */}
          <div className="flex flex-col items-center space-y-2 mt-4">
            <div className="relative">
              <Image
                src="/profile.jpg"
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Input
                  value={fullname}
                  onChange={handleFullnameChange}
                  onBlur={saveFullname}
                  onKeyDown={(e) => e.key === "Enter" && saveFullname()}
                  autoFocus
                  className="w-40 text-center"
                />
              ) : (
                <h2 className="text-lg font-semibold">{fullname}</h2>
              )}
              <FaPen
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setIsEditing(true)}
              />
            </div>
            <p className="text-sm text-gray-500">Inscrit le 12/01/2023</p>
          </div>

          <Separator className="my-4" />

          {/* Paramètres */}
          <div className="space-y-4">
            {/* Langue */}
            <div>
              <Label>Langue</Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
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
              <Select
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
              >
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
              <Switch
                checked={rounding}
                onCheckedChange={setRounding}
              />
            </div>
          </div>
        </div>

        {/* Bouton Déconnexion */}
        <Button variant="destructive" className="mt-6 w-full">
          Déconnexion
        </Button>
      </SheetContent>
    </Sheet>
  );
}
