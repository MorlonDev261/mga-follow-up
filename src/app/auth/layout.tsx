import Image from "next/image";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col mb-2 items-center">
        <Image src="/logo.png" width="100" height="50" alt="Logo" />
        <Image src="/logo-name.png" width="50" height="50" alt="Logo name" />
      </div>
      {children}
    </>
  );
}
