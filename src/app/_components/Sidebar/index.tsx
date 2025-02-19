import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import "./Sidebar.css";

interface SidebarProps {
  sidebarState: boolean;
  setSidebarState: React.Dispatch<React.SetStateAction<boolean>>;

}

const Sidebar = ({ sidebarState, setSidebarState }: SidebarProps) => {
  return (
    <aside className="sidebar">
      <Sheet open={sidebarState} onOpenChange={setSidebarState}>
        <SheetContent 
          side="left"
          className="data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
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
