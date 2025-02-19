import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar = ({ isSidebarOpen }: SidebarProps) => {
  return (
    <aside className="sidebar">
      <Sheet open={isSidebarOpen}>
        <SheetContent 
          side="left"
          className="data-[state=open]:animate-in data-[state=closed]:animate-out 
                     data-[state=closed]:fade-out data-[state=open]:fade-in 
                     data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
          >
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </aside>
  );
};

export default Sidebar;
