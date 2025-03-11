"use client";

import { useState, ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Theme from "@components/Theme";
import Sidebar from "@components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaRegEnvelope } from "react-icons/fa6";
import { FiBell } from "react-icons/fi";

type HeaderProps = {
  children?: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { push } = router;

  const togglePath = (type: "dashboard" | "rows") => {
    let newPath = pathname;

    if (type === "dashboard") {
      if (pathname.startsWith("/rows")) {
        newPath = pathname.replace(/^\/rows/, "") || "/";
      }
    } else if (type === "rows") {
      if (!pathname.startsWith("/rows")) {
        newPath = "/rows" + pathname.replace(/^\/+/, ""); // Évite "/rows/rows"
      }
    }

    push(newPath.replace("//", "/")); // Nettoyage final
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#111] p-2 transition-colors border-b border-gray-300 dark:border-none">
      {/* Top section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Bouton de navigation */}
            <div
              className={cn(
               "rounded-full cursor-pointer bg-red-600 dark:hover:bg-gray-500 transition",
               "overflow-hidden transition-[width] transition-[padding] duration-1000",
                pathname !== "/" ? "w-[20px] p-1 hover:bg-gray-200" : "w-0 p-0"
              )}
              onClick={() => pathname !== "/" && router.back()}
            >
              <MdOutlineArrowBackIosNew className="text-xl text-gray-800 dark:text-white" />
            </div>

          {/* Logo Image */}
          <div className="flex mb-3 items-center">
            <Image
              src="/main-logo.png"
              width={150}
              height={30}
              alt="logo"
              priority
            />
          </div>
        </div>

        {/* Mode Toggle (Dashboard / Excel) */}
        <div className="hidden sm:flex w-full max-w-[250px] items-center rounded bg-gray-200 dark:bg-white/10 p-1 text-sm sm:text-md">
          <button
            aria-label="Switch to Dashboard"
            className={cn(
              "w-1/2 rounded p-1 transition",
              !pathname.startsWith("/rows")
                ? "bg-white dark:bg-white/40 pointer-events-none"
                : "hover:bg-white/60 dark:hover:bg-white/20"
            )}
            onClick={() => togglePath("dashboard")}
          >
            Dashboard
          </button>
          <button
            aria-label="Switch to Excel"
            className={cn(
              "w-1/2 rounded p-1 transition",
              pathname.startsWith("/rows")
                ? "bg-white dark:bg-white/40 pointer-events-none"
                : "hover:bg-white/60 dark:hover:bg-white/20"
            )}
            onClick={() => togglePath("rows")}
          >
            Excel
          </button>
        </div>

        {/* Notifications & Messages */}
        <div className="flex items-center gap-4">
          <Link href="/messages">
            <FaRegEnvelope className="text-xl cursor-pointer text-gray-800 dark:text-white" />
          </Link>
          <Link href="/notifications">
            <FiBell className="text-xl cursor-pointer text-gray-800 dark:text-white" />
          </Link>

          {/* --Theme Toggle-- */}
          <Theme />

          {/* Profil */}
          <div className="profile flex items-center gap-1">
            <Avatar
              className="h-7 w-7 border border-gray-300 dark:border-white cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <AvatarImage src="/profile.jpg" />
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <span className="hidden md:flex text-gray-800 dark:text-white">
              Hi, Morlon
            </span>
          </div>
        </div>
      </div>

      <Sidebar open={open} setOpen={setOpen} />

      {/* Search & Scan */}
      {children}
    </header>
  );
}
