'use client';

import Link from 'next/link';
import './Header.css';
import { FaRegEnvelope } from "react-icons/fa6";
import { FaBars, FaRegBell } from 'react-icons/fa';

const Header = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="nav-section">
          <button data-sidebar-type="sidebar-left" className="nav-button menu-button">
            <FaBars className="icon" />
          </button>
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
