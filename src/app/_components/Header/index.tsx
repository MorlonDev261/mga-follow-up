'use client';

import Link from 'next/link';
import Image from "next/image";
import './Header.css';
import { FaRegEnvelope } from "react-icons/fa6";
import { FaBars, FaTimes, FaRegBell } from 'react-icons/fa';

interface HeaderProps {
  sidebarState: "open" | "closed";
  toggleSidebar: () => void;
}

const Header = ({ setIsSidebarOpen, isSidebarOpen }: HeaderProps) => {
  return (
    <header>
      <nav className="navbar">
        <div className="nav-section">
          <button onClick={toggleSidebar} className="nav-button menu-button">
            {sidebarState === "open" ? <FaTimes className="icon" /> : <FaBars className="icon" />}
          </button>

          <div className="flex items-center gap-1">
            <b className="hidden">AZTEK DWC LLC</b>
            <Image className="logo" src="/icons/logo-aztek.svg" alt="AZTEK DWC LLC" width={120} height={20} />
          </div>
        </div>
        
        <div className="nav-section">
          <Link href="#" className="nav-button message-button">
            <FaRegEnvelope className="icon" />
            <span className="count">5</span>
          </Link>
          <button className="nav-button notif-button">
            <FaRegBell className="icon" />
            <span className="count">1</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
