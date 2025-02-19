import { FaTimes } from 'react-icons/fa';
import "./Sidebar.css";

interface SidebarProps {
  sidebarState: boolean;
  setSidebarState: React.Dispatch<React.SetStateAction<boolean>>;

}

const Sidebar = ({ sidebarState, setSidebarState }: SidebarProps) => {
  return (
    <aside className={`sidebar ${sidebarState ? "active" : ""}`}>
      <div className="nav-section p-5 nav-left">
          <Link href="/" className="nav-logo">
              <Image src="/icons/logo-aztek.svg" alt="Logo" width={50} height={50} className="logo-image" />
          </Link>
          <button className="nav-button theme-button" onClick={() => setSidebarState(false)}>
            <FaTimes />
          </button>
        </div>
      
        <div className="link-container">
          {/* Section principale */}
          <div className="link-section">
            <Link href="/products" className="link-item change-type">
              <Image className="profile rounded-full" src="/users/profile-1.jpg" width="30" height="30" alt="ShopCell" /> 
              <span>Shop Cell</span>
              <small>Last updated: 12 mai</small>
            </Link>
            <Link href="/products" className="link-item change-type">
              <Image className="profile" src="/users/profile-1.jpg" width="30" height="30" alt="ShopCell" /> 
              <span>Shop Cell</span>
              <small>Last updated: 12 mai</small>
            </Link>
            <Link href="/products" className="link-item change-type">
              <Image className="profile" src="/users/profile-1.jpg" width="30" height="30" alt="ShopCell" /> 
              <span>Shop Cell</span>
              <small>Last updated: 12 mai</small>
            </Link>
          </div>


          <div className="section-separator" />
        </div>
    </aside>
  );
};

export default Sidebar;
