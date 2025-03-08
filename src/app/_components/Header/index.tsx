"use client";

import { ReactNode } from "react";
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
    <header className="sticky top-0 z-50 w-full bg-[#111] p-2">
      {/* Top section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Bouton de navigation */}
          {pathname !== "/" && (
            <div
              className="rounded-full p-1 hover:bg-gray-500 cursor-pointer"
              onClick={() => router.back()}
            >
              <MdOutlineArrowBackIosNew className="text-xl" />
            </div>
          )}

          {/* Logo Image */}
          <div className="flex mb-3 items-center">
            <Image
              src="/main-logo.png"
              width={150}
              height={40}
              alt="logo"
              priority
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
            <FaRegEnvelope className="text-xl cursor-pointer" />
          </Link>
          <Link href="/notifications">
            <FiBell className="text-xl cursor-pointer" />
          </Link>

          {/* Profil */}
          <Image
            src="/profile.jpg"
            width={30}
            height={30}
            alt="profile"
            onClick={() => setOpen(!open)}
            className="rounded-full border border-white cursor-pointer"
          />
        </div>
      </div>
       <Sidebar open={open} setOpen={setOpen} />
      {/* Search & Scan */}
      {children}
    </header>
  );
}
