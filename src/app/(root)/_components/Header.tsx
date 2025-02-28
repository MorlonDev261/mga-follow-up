"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FaRegEnvelope } from "react-icons/fa6";
import { FiBell, FiSearch } from "react-icons/fi";
import { LuScanLine } from "react-icons/lu";

export default function Header() {
  const pathname = usePathname();
  const { push } = useRouter();

  const togglePath = (type: "dashboard" | "rows") => {
    let newPath = pathname;

    if (type === "dashboard") {
      if (pathname.startsWith("/rows")) {
        newPath = pathname.replace(/^\/rows/, ""); // Supprime uniquement si au début
      }
    } else if (type === "rows") {
      if (!pathname.startsWith("/rows")) {
        newPath = "/rows" + pathname; // Ajoute "/excel"
      }
    }
    push(newPath);
  };


  return (
    <header className="sticky top-0 z-50 w-full bg-[#111] p-2">
      {/* Top section */}
      <div className="flex items-center justify-between gap-4">
        {/* Profile Image */}
        <Image
          src="/profile.jpg"
          width={30}
          height={30}
          alt="profile"
          className="rounded-full w-50 h-50 border border-white cover"
        />

        {/* Mode Toggle (Dashboard / Excel) */}
        <div className="flex w-full max-w-[250px] items-center rounded bg-white/10 p-1">
          <button
            className={cn("w-1/2 rounded p-1", !pathname.startsWith("/rows") && "bg-white/40")}
            onClick={() => togglePath("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={cn("w-1/2 rounded p-1", pathname.startsWith("/rows") && "bg-white/40")}
            onClick={() => togglePath("rows")}
          >
            Excel
          </button>
        </div>

        {/* Notifications & Messages */}
        <div className="flex items-center gap-4">
          <FaRegEnvelope className="text-xl" />
          <FiBell className="text-xl" />
        </div>
      </div>

      {/* Search & Scan */}
      <div className="mt-2 flex items-center gap-2">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Recherche..."
            className="w-full rounded-full bg-[#222] py-1 pl-10 pr-4 outline-none"
          />
        </div>
        <Link href="/scan">
          <LuScanLine className="text-2xl" />
        </Link>
      </div>
    </header>
  );
}
