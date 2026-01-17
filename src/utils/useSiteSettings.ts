import { useEffect, useState } from "react";
import {
  applySettings,
  readSettings,
  setSettings,
  toggleArch,
  toggleMotion,
  toggleTheme,
  type SiteSettings,
} from "./siteSettings";

export const useSiteSettings = () => {
  const [settings, setCurrent] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const current = readSettings();
    applySettings(current);
    setCurrent(current);

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<SiteSettings>).detail;
      setCurrent(detail);
    };

    window.addEventListener("site:settings", handler);
    return () => window.removeEventListener("site:settings", handler);
  }, []);

  return {
    settings,
    toggleTheme,
    toggleMotion,
    toggleArch,
    setSettings,
  };
};
