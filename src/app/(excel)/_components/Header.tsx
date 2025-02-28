"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FaRegEnvelope } from "react-icons/fa6";
import { FiBell } from "react-icons/fi";

export default function Header() {
  const pathname = usePathname();
  const { push } = useRouter();

  const togglePath = (type: "dashboard" | "excel") => {
    let newPath = pathname;

    if (type === "dashboard") {
      if (pathname.startsWith("/excel")) {
        newPath = pathname.replace("/excel", ""); // Supprime "/excel"
      }
    } else if (type === "excel") {
      if (!pathname.startsWith("/excel")) {
        newPath = "/excel" + pathname; // Ajoute "/excel"
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
            className={cn("w-1/2 rounded p-1", !pathname.startsWith("/excel") && "bg-white/40")}
            onClick={() => togglePath("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={cn("w-1/2 rounded p-1", pathname.startsWith("/excel") && "bg-white/40")}
            onClick={() => togglePath("excel")}
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
    </header>
  );
}
