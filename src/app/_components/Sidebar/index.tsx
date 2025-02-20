import Link from "next/link";
import Image from "next/image";
import { FaTimes, FaPlus } from "react-icons/fa";
import "./CSS/Sidebar.css";

interface SidebarProps {
  sidebarState: boolean;
  setSidebarState: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ sidebarState, setSidebarState }: SidebarProps) => {
  return (
    <>
      {/* Overlay */}
      <div className={`overlay-sidebar ${sidebarState ? "active" : ""}`} onClick={() => setSidebarState(false)}></div>

      <aside className={`sidebar bg-white ${sidebarState ? "active" : ""}`}>
        <div className="nav-section header border-b-2 border-gray-900">
          <Link href="/" className="nav-logo">
            <Image src="/icons/logo-aztek.svg" alt="Logo" width={120} height={20} className="logo-image" />
          </Link>
          <button className="nav-button close-sidebar" onClick={() => setSidebarState(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="link-container">
          <div className="link-section">
            <button className="link-item new-customer">
              <FaPlus /> <span>Add new Customer</span>
            </button>
            <Link href="/products" className="link-item">
              <Image className="profile rounded-full" src="/users/profile-1.jpg" width="40" height="40" alt="ShopCell" />
              <div className="flex flex-col">
                 <span>Shop Cell</span>
                 <small>Last updated: 12 mai</small>
              </div>
            </Link>
            <Link href="/products" className="link-item">
              <Image className="profile rounded-full" src="/users/profile-1.jpg" width="40" height="40" alt="ShopCell" />
              <div className="flex flex-col">
                 <span>Shop Cell</span>
                 <small>Last updated: 12 mai</small>
              </div>
            </Link>
            <Link href="/products" className="link-item">
              <Image className="profile rounded-full" src="/users/profile-1.jpg" width="40" height="40" alt="ShopCell" />
              <div className="flex flex-col">
                 <span>Shop Cell</span>
                 <small>Last updated: 12 mai</small>
              </div>
            </Link>
          </div>

          <div className="section-separator" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
