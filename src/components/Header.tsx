import { useSiteSettings } from "../utils/useSiteSettings";

type HeaderProps = {
  name: string;
  role: string;
};

const Header = ({ name, role }: HeaderProps) => {
  const { settings, toggleTheme, toggleArch } = useSiteSettings();

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("site:palette"));
  };

  return (
    <header className="site-header">
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
