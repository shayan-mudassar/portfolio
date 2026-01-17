import { useEffect, useRef, useState } from "react";

const EasterEgg = () => {
  const [active, setActive] = useState(false);
  const bufferRef = useRef("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || target.isContentEditable) {
        return;
      }

      if (!/^[a-z]$/i.test(event.key)) return;
      bufferRef.current = (bufferRef.current + event.key).slice(-3).toLowerCase();

      if (bufferRef.current === "dlq") {
        setActive(true);
        bufferRef.current = "";
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setActive(false), 1600);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className={`dlq-easter ${active ? "active" : ""}`} aria-hidden="true">
      Dead Letter Queue released
    </div>
  );
};

export default EasterEgg;
