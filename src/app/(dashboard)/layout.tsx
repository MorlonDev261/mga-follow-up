import Header from "@components/Header";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      {/*<aside role="navigation">
        <Sidebar open={open} setOpen={setOpen} />
      </aside>*/}
        <Header />
        {children}
  );
}
