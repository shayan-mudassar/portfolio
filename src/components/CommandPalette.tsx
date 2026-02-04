import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { profile } from "../data/profile";
import { setHash } from "../utils/hashRouting";
import { useSiteSettings } from "../utils/useSiteSettings";

type Command = {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
};

const CommandPalette = () => {
  const { settings, toggleTheme, toggleMotion, toggleArch } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const jumpToSection = (id: string) => {
    setHash(id);
  };

  const commands = useMemo<Command[]>(
    () => [
      { id: "playground", label: "Go to Playground", run: () => jumpToSection("playground") },
      { id: "experience", label: "Go to Experience", run: () => jumpToSection("experience") },
      { id: "projects", label: "Go to Projects", run: () => jumpToSection("projects") },
      { id: "skills", label: "Go to Skills", run: () => jumpToSection("skills") },
      { id: "certs", label: "Go to Certifications", run: () => jumpToSection("certifications") },
      { id: "contact", label: "Go to Contact", run: () => jumpToSection("contact") },
      {
        id: "jump-sentinel",
        label: "Jump to Sentinel case study",
        hint: "Projects",
        run: () => setHash("projects", { project: "sentinel" }),
      },
      {
        id: "jump-anomaly",
        label: "Jump to Anomaly Lab",
        hint: "Projects",
        run: () => setHash("projects", { project: "anomaly" }),
      },
      {
        id: "jump-arch",
        label: "Open Architecture Mode",
        hint: "Playground",
        run: () => {
          if (settings?.arch !== "on") toggleArch();
          jumpToSection("playground");
        },
      },
      {
        id: "github",
        label: "Open GitHub",
        hint: "Repo",
        run: () => window.open(profile.links.github, "_blank", "noopener,noreferrer"),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        hint: "Profile",
        run: () => window.open(profile.links.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "sentinel",
        label: "Open Sentinel Incident Platform repo",
        hint: "Project",
        run: () =>
          window.open(
            "https://github.com/shayan-mudassar/sentinel-incident-platform",
            "_blank",
            "noopener,noreferrer"
          ),
      },
      {
        id: "anomaly",
        label: "Open Network Anomaly Detection repo",
        hint: "Project",
        run: () =>
          window.open(
            "https://github.com/shayan-mudassar/network-anomaly-detection",
            "_blank",
            "noopener,noreferrer"
          ),
      },
      { id: "theme", label: "Toggle Theme", hint: settings?.theme, run: toggleTheme },
      {
        id: "motion",
        label: "Toggle Reduced Motion",
        hint: settings?.motion,
        run: toggleMotion,
      },
      { id: "arch", label: "Toggle Architecture Mode", hint: settings?.arch, run: toggleArch },
    ],
    [settings, toggleTheme, toggleMotion, toggleArch]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter((command) => command.label.toLowerCase().includes(lower));
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    setQuery("");
    const handle = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(handle);
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const isK = event.key.toLowerCase() === "k";
      if ((event.ctrlKey || event.metaKey) && isK) {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("site:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("site:palette", onOpen);
    };
  }, []);

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const command = filtered[activeIndex];
      if (command) {
        command.run();
        setOpen(false);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="command-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setOpen(false)}
    >
      <div className="command-panel" onClick={(event) => event.stopPropagation()}>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Type a command or jump to a section..."
          aria-label="Command palette"
        />
        <div className="command-list" role="listbox">
          {filtered.map((command, index) => (
            <button
              key={command.id}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className={`command-item ${index === activeIndex ? "active" : ""}`}
              onClick={() => {
                command.run();
                setOpen(false);
              }}
            >
              <span>{command.label}</span>
              {command.hint ? <span className="pill">{command.hint}</span> : null}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="command-item">No matches. Try "projects" or "theme".</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
