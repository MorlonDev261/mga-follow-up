"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Assurez-vous que cette fonction existe dans lib/utils.ts
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaRegEnvelope } from "react-icons/fa6";
import { FiBell } from "react-icons/fi";

type HeaderProps = {
  children?: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  const pathname = usePathname();
  const { push } = useRouter(); // On garde uniquement cette version de useRouter
  
  const togglePath = (type: "dashboard" | "rows") => {
    let newPath = pathname;

    if (type === "dashboard") {
      if (pathname.startsWith("/rows")) {
        newPath = pathname.replace(/^\/rows/, "") || "/"; // Supprime uniquement si au début
      }
    } else if (type === "rows") {
      if (!pathname.startsWith("/rows")) {
        newPath = "/rows" + pathname; // Ajoute "/rows"
      }
    }
    push(newPath);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#111] p-2">
      {/* Top section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Bouton de navigation */}
          {pathname !== "/" && (
            <div
              className="rounded-full p-1 hover:bg-gray-500"
              onClick={() => push("/")} // Utilisation de push pour revenir à la page précédente
            >
              <MdOutlineArrowBackIosNew className="text-xl" />
            </div>
          )}

          {/* Logo Image */}
          <div className="flex items-center gap-1">
            <Image
              src="/logo.png"
              width={50}
              height={40}
              alt="logo"
              className="cover hidden"
            />
            <Image
              src="/logo-name.png"
              width={30}
              height={30}
              alt="logo"
              className="w-auto h-12"
            />
          </div>
        </div>

        {/* Mode Toggle (Dashboard / Excel) */}
        <div className="hidden sm:flex w-full max-w-[250px] items-center rounded bg-white/10 p-1 text-sm sm:text-md">
          <button
            aria-label="Switch to Dashboard"
            className={cn("w-1/2 rounded p-1", !pathname.startsWith("/rows") && "bg-white/40 pointer-events-none")}
            onClick={() => togglePath("dashboard")}
          >
            Dashboard
          </button>
          <button
            aria-label="Switch to Excel"
            className={cn("w-1/2 rounded p-1", pathname.startsWith("/rows") && "bg-white/40 pointer-events-none")}
            onClick={() => togglePath("rows")}
          >
            Excel
          </button>
        </div>

        {/* Notifications & Messages */}
        <div className="flex items-center gap-4">
          <Link href="/messages">
            <FaRegEnvelope className="text-xl" />
          </Link>
          <Link href="/notifications">
            <FiBell className="text-xl" />
          </Link>

          {/* Profil */}
          <Image
            src="/profile.jpg"
            width={30}
            height={30}
            alt="profile"
            className="rounded-full border border-white"
          />
        </div>
      </div>

      {/* Search & Scan */}
      {children}
    </header>
  );
}
