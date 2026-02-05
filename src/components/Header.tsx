import { useEffect, useRef } from "react";
import { useSiteSettings } from "../utils/useSiteSettings";

type HeaderProps = {
  name: string;
  role: string;
};

const Header = ({ name, role }: HeaderProps) => {
  const { settings, toggleTheme, toggleArch } = useSiteSettings();
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const applyHeight = () => {
      const height = headerRef.current?.offsetHeight ?? 76;
      document.documentElement.style.setProperty("--header-height", `${height}px`);
    };

    applyHeight();
    const observer = new ResizeObserver(() => applyHeight());
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    window.addEventListener("resize", applyHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applyHeight);
    };
  }, []);

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("site:palette"));
  };

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container header-inner">
        <a className="brand" href="#home">
          {name}
          <span>{role}</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#playground">Playground</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#certifications">Certifications</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-controls">
          <button
            className="control-button"
            type="button"
            aria-pressed={settings?.arch === "on"}
            onClick={toggleArch}
          >
            Arch Mode
          </button>
          <button
            className="control-button"
            type="button"
            aria-pressed={settings?.theme === "dark"}
            onClick={toggleTheme}
          >
            Theme
          </button>
          <button className="control-button" type="button" onClick={openPalette} aria-label="Command palette">
            Cmd
          </button>
          {settings?.arch === "on" ? (
            <span className="arch-mode-indicator">Architecture Mode On</span>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
