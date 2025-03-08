import Header from "@components/Header";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/*<aside role="navigation">
        <Sidebar open={open} setOpen={setOpen} />
      </aside>*/}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
