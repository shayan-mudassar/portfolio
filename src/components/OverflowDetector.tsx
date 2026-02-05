import { useEffect } from "react";

const OVERFLOW_ATTR = "data-overflow-debug";

const OverflowDetector = () => {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const detectOverflow = () => {
      const viewportWidth = window.innerWidth;
      const elements = Array.from(document.querySelectorAll<HTMLElement>("body *"));
      const offenders: Array<{ tag: string; className: string; width: number }> = [];

      elements.forEach((element) => {
        element.removeAttribute(OVERFLOW_ATTR);
        const rect = element.getBoundingClientRect();
        if (rect.width <= viewportWidth + 0.5 && rect.left >= -0.5 && rect.right <= viewportWidth + 0.5) {
          return;
        }

        element.setAttribute(OVERFLOW_ATTR, "true");
        offenders.push({
          tag: element.tagName.toLowerCase(),
          className: element.className || "(no class)",
          width: Math.round(rect.width),
        });
      });

      if (offenders.length > 0) {
        console.groupCollapsed(`[overflow-debug] ${offenders.length} overflowing element(s)`);
        offenders.slice(0, 25).forEach((item) => {
          console.log(`${item.tag} ${item.className} -> ${item.width}px`);
        });
        console.groupEnd();
      }
    };

    const handle = window.setTimeout(detectOverflow, 120);
    window.addEventListener("resize", detectOverflow);
    window.addEventListener("hashchange", detectOverflow);

    const observer = new MutationObserver(() => detectOverflow());
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.clearTimeout(handle);
      window.removeEventListener("resize", detectOverflow);
      window.removeEventListener("hashchange", detectOverflow);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default OverflowDetector;
