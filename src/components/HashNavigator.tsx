import { useEffect } from "react";
import { parseHash } from "../utils/hashRouting";

const scrollToId = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  const prefersReduced =
    document.documentElement.dataset.motion === "reduced" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
};

const highlightProject = (project: string | null) => {
  const cards = document.querySelectorAll<HTMLElement>("[data-project-card]");
  cards.forEach((card) => {
    const key = card.dataset.projectCard;
    if (project && key === project) {
      card.dataset.projectActive = "true";
      card.setAttribute("aria-current", "true");
    } else {
      card.removeAttribute("data-project-active");
      card.removeAttribute("aria-current");
    }
  });
};

const handleHash = () => {
  const { section, params } = parseHash(window.location.hash);
  if (!section) return;

  if (section === "projects") {
    const project = params.get("project")?.toLowerCase() ?? null;
    if (project === "sentinel" || project === "anomaly") {
      highlightProject(project);
      scrollToId(`project-${project}`);
      return;
    }
    highlightProject(null);
    scrollToId("projects");
    return;
  }

  highlightProject(null);
  scrollToId(section);
};

const HashNavigator = () => {
  useEffect(() => {
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return null;
};

export default HashNavigator;
