import { useState } from "react";
import { Menu, X, Briefcase } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = ["Home", "Jobs", "Post a Job"];

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-mark">
            <Briefcase size={18} strokeWidth={2.4} />
          </span>
          <span className="logo-text">
            SHIFT<span className="logo-accent">BOARD</span>
          </span>
        </div>

        <nav className="nav-links desktop-only">
          {navLinks.map((link) => (
            <a key={link} href="#" className="nav-link">
              {link}
            </a>
          ))}
        </nav>

        <div className="header-actions desktop-only">
          <button className="btn-signin">Sign In</button>
        </div>

        <button
          className="menu-toggle mobile-only"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <a key={link} href="#" className="nav-link">
              {link}
            </a>
          ))}
          <button className="btn-signin full-width">Sign In</button>
        </div>
      )}
    </header>
  );
}
