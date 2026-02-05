import { useEffect, useId, useRef, useState } from "react";

type Item = {
  label: string;
  detail: string;
  score: string;
};

type Props = {
  items: Item[];
};

const ReliabilityScorecardList = ({ items }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const idBase = useId();

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const target = event.target as Node | null;
      if (!target || containerRef.current.contains(target)) return;
      setOpenIndex(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenIndex(null);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="scorecard" ref={containerRef}>
      {items.map((item, index) => {
        const id = `${idBase}-${index}`;
        const isOpen = openIndex === index;

        return (
          <div key={item.label} className="scorecard-item-wrap">
            <button
              type="button"
              className="scorecard-item tooltip"
              data-tooltip={item.detail}
              aria-label={`${item.label}: ${item.detail}`}
              aria-expanded={isOpen}
              aria-controls={`${id}-panel`}
              onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
            >
              <strong>{item.label}</strong>
              <span>{item.score}</span>
            </button>
            <div
              id={`${id}-panel`}
              className={`scorecard-popover ${isOpen ? "active" : ""}`}
              role="status"
              aria-hidden={!isOpen}
            >
              {item.detail}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReliabilityScorecardList;
