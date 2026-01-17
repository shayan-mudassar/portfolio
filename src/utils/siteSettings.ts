export type Theme = "light" | "dark";
export type Motion = "full" | "reduced";
export type ArchMode = "on" | "off";

export type SiteSettings = {
  theme: Theme;
  motion: Motion;
  arch: ArchMode;
};

const STORAGE_KEY = "shayan-site-settings";

const defaultSettings = (): SiteSettings => {
  if (typeof window === "undefined") {
    return { theme: "light", motion: "full", arch: "off" };
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return {
    theme: prefersDark ? "dark" : "light",
    motion: prefersReduced ? "reduced" : "full",
    arch: "off",
  };
};

export const readSettings = (): SiteSettings => {
  const defaults = defaultSettings();
  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
};

export const applySettings = (settings: SiteSettings) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = settings.theme;
  root.dataset.motion = settings.motion;
  if (settings.arch === "on") {
    root.dataset.arch = "on";
  } else {
    delete root.dataset.arch;
  }
};

const emitSettings = (settings: SiteSettings) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("site:settings", { detail: settings }));
};

export const setSettings = (partial: Partial<SiteSettings>) => {
  const next = { ...readSettings(), ...partial };
  applySettings(next);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  emitSettings(next);
  return next;
};

export const toggleTheme = () => {
  const current = readSettings();
  return setSettings({ theme: current.theme === "dark" ? "light" : "dark" });
};

export const toggleMotion = () => {
  const current = readSettings();
  return setSettings({ motion: current.motion === "reduced" ? "full" : "reduced" });
};

export const toggleArch = () => {
  const current = readSettings();
  return setSettings({ arch: current.arch === "on" ? "off" : "on" });
};
