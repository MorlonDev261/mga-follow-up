import Header from "@components/Header";
//import Download from "@components/Download";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
