import { useEffect, useMemo, useRef, useState } from "react";

type BusNode = {
  label: string;
  tooltip: string;
};

const nodes: BusNode[] = [
  { label: "API Gateway", tooltip: "Idempotency + auth guard" },
  { label: "Lambda", tooltip: "Retries + backoff" },
  { label: "DynamoDB / RDS", tooltip: "Outbox + atomic writes" },
  { label: "EventBridge / SQS", tooltip: "DLQ + fan-out" },
  { label: "Observability", tooltip: "Tracing + alerts" },
];

const EventBus = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const activeRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);
  const busRef = useRef<HTMLDivElement | null>(null);

  const geometry = useMemo(() => {
    const startX = 50;
    const endX = 590;
    const lineY = 80;
    const labelY = 120;
    const positions = nodes.map((_, index) =>
      startX + (index / (nodes.length - 1)) * (endX - startX)
    );
    return { startX, endX, lineY, labelY, positions };
  }, []);

  useEffect(() => {
    dotRef.current?.setAttribute("cx", geometry.startX.toString());
    dotRef.current?.setAttribute("cy", geometry.lineY.toString());
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [geometry.lineY, geometry.startX]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as globalThis.Node | null;
      if (!target || !busRef.current) return;
      if (busRef.current.contains(target)) return;
      setFocusedIndex(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFocusedIndex(null);
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

  const emit = () => {
    if (running) return;
    setRunning(true);
    const start = performance.now();
    const prefersReduced = document.documentElement.dataset.motion === "reduced";
    if (prefersReduced) {
      setActiveIndex(nodes.length - 1);
      dotRef.current?.setAttribute("cx", geometry.endX.toString());
      window.setTimeout(() => {
        setActiveIndex(-1);
        setRunning(false);
        dotRef.current?.setAttribute("cx", geometry.startX.toString());
      }, 120);
      return;
    }

    const duration = 2600;

    const update = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const x = geometry.startX + (geometry.endX - geometry.startX) * progress;
      dotRef.current?.setAttribute("cx", x.toFixed(2));

      const idx = Math.min(nodes.length - 1, Math.floor(progress * (nodes.length - 1 + 0.0001)));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActiveIndex(idx);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(update);
      } else {
        setTimeout(() => {
          setActiveIndex(-1);
          setRunning(false);
          dotRef.current?.setAttribute("cx", geometry.startX.toString());
        }, 400);
      }
    };

    rafRef.current = requestAnimationFrame(update);
  };

  const selectedNodeIndex = activeIndex >= 0 ? activeIndex : focusedIndex;
  const selectedNode = selectedNodeIndex !== null && selectedNodeIndex >= 0 ? nodes[selectedNodeIndex] : null;
  const selectedNodePopoverId = selectedNodeIndex !== null ? `event-bus-tip-${selectedNodeIndex}` : undefined;

  return (
    <div className="event-bus" ref={busRef}>
      <div className="event-bus-header">
        <div className="event-bus-title">Event Bus</div>
        <div className="pill">Event-driven flow</div>
      </div>
      <svg
        className="event-bus-svg"
        viewBox="0 0 640 160"
        role="img"
        aria-label="Event bus flow"
      >
        <line
          className="bus-track"
          x1={geometry.startX}
          y1={geometry.lineY}
          x2={geometry.endX}
          y2={geometry.lineY}
        />
        <circle ref={dotRef} className="bus-dot" r="7" />
        {nodes.map((node, index) => (
          <g
            key={node.label}
            className={`bus-node ${activeIndex === index || focusedIndex === index ? "active" : ""}`}
            transform={`translate(${geometry.positions[index]}, ${geometry.lineY})`}
            role="button"
            tabIndex={0}
            aria-pressed={focusedIndex === index}
            aria-expanded={focusedIndex === index}
            aria-controls={`event-bus-tip-${index}`}
            aria-label={`${node.label}: ${node.tooltip}`}
            onClick={() => setFocusedIndex((prev) => (prev === index ? null : index))}
            onFocus={() => setFocusedIndex(index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setFocusedIndex((prev) => (prev === index ? null : index));
              }
            }}
          >
            <title>{node.tooltip}</title>
            <rect className="bus-node-hitbox" x="-22" y="-22" width="44" height="44" rx="22" />
            <circle className="bus-node-dot" r="10" />
            <text className="bus-node-label" y={geometry.labelY - geometry.lineY} textAnchor="middle">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="event-bus-controls">
        <button className="bus-button" type="button" onClick={emit} disabled={running}>
          Emit event
        </button>
        <div className="bus-note">Watch idempotency, retries, outbox, and DLQ kick in.</div>
      </div>
      {selectedNode ? (
        <div className="event-bus-popover" id={selectedNodePopoverId} role="status">
          <strong>{selectedNode.label}</strong>
          <p>{selectedNode.tooltip}</p>
        </div>
      ) : null}
    </div>
  );
};

export default EventBus;
