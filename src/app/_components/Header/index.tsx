"use client";

import { useState, useEffect, ReactNode, Suspense } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Theme from "@components/Theme";
import Sidebar from "@components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaRegEnvelope } from "react-icons/fa6";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { getCompanyById } from "@/actions";

type HeaderProps = {
  children?: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string | null>(null); // Ajouté pour stocker le nom de l'entreprise
  const pathname = usePathname();
  const router = useRouter();
  const { push } = router;

  const { data: session } = useSession();

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (session?.selectedCompany) {
        const company = await getCompanyById(session.selectedCompany);
        if (company) {
          setCompanyName(company.name); // Mise à jour de l'état
        }
      }
    };

    fetchCompanyInfo();
  }, [session?.selectedCompany]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#111] p-2 transition-colors border-b border-gray-300 dark:border-none">
      {/* Top section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Back button */}
          {pathname !== "/" && (
            <button
              className="rounded-full p-1 cursor-pointer dark:hover:bg-gray-500 transition hover:bg-gray-200"
              onClick={() => router.back()}
            >
              <MdOutlineArrowBackIosNew className="text-xl text-gray-800 dark:text-white" />
            </button>
          )}

          {/* Logo */}
          <div className="flex flex-col gap-1">
            <Link href="/" className="flex items-center mb-3">
              <Image
                src="/main-logo.png"
                width={150}
                height={30}
                alt="logo"
                priority
                className="h-auto"
              />
            </Link>
            {companyName && (
              <span className="font-bold italic text-sm text-gray-700 dark:text-gray-200">
                {companyName}
              </span>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="hidden sm:flex w-full max-w-[250px] items-center rounded bg-gray-200 dark:bg-white/10 p-1 text-sm sm:text-md">
          <button
            className={cn(
              "w-1/2 rounded p-1 transition",
              !pathname.startsWith("/rows")
                ? "bg-white dark:bg-white/40 pointer-events-none"
                : "hover:bg-white/60 dark:hover:bg-white/20"
            )}
            onClick={() => push(pathname.replace(/^\/rows/, "") || "/")}
          >
            Dashboard
          </button>
          <button
            className={cn(
              "w-1/2 rounded p-1 transition",
              pathname.startsWith("/rows")
                ? "bg-white dark:bg-white/40 pointer-events-none"
                : "hover:bg-white/60 dark:hover:bg-white/20"
            )}
            onClick={() => push(pathname.startsWith("/rows") ? pathname : `/rows${pathname}`)}
          >
            Excel
          </button>
        </div>

        {/* Right section */}
        {session?.user ? (
          <div className="flex items-center gap-4">
            {/* Messages */}
            <Link
              href="/messages"
              className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FaRegEnvelope className="text-xl" />
            </Link>

            {/* Notifications */}
            <Link
              href="/notifications"
              className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            >
              {pathname === "/notifications" ? (
                <IoNotifications className="text-xl" />
              ) : (
                <IoNotificationsOutline className="text-xl" />
              )}
            </Link>

            {/* Theme Toggle */}
            <Theme />

            {/* Profile */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
              <Suspense>
                <Avatar className="h-7 w-7 border border-gray-300 dark:border-white">
                  {session.user.image ? (
                    <AvatarImage src={session.user.image} />
                  ) : (
                    <AvatarFallback>
                      {session.user.name?.[0]?.toUpperCase() || 'MGA'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="hidden md:block text-gray-800 dark:text-white">
                  Hi, {session.user.name?.split(' ')[0] || 'User'}
                </span>
              </Suspense>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Theme />
            <Link
              href="/login"
              className="text-white bg-blue-500 px-2 py-1 hover:bg-blue-600 rounded-md"
            >
              Se connecter
            </Link>
          </div>
        )}
      </div>

      <Sidebar open={open} setOpen={setOpen} />
      {children}
    </header>
  );
}
