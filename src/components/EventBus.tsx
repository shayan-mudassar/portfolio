import { useEffect, useMemo, useRef, useState } from "react";

type Node = {
  label: string;
  tooltip: string;
};

const nodes: Node[] = [
  { label: "API Gateway", tooltip: "Idempotency + auth guard" },
  { label: "Lambda", tooltip: "Retries + backoff" },
  { label: "DynamoDB / RDS", tooltip: "Outbox + atomic writes" },
  { label: "EventBridge / SQS", tooltip: "DLQ + fan-out" },
  { label: "Observability", tooltip: "Tracing + alerts" },
];

const EventBus = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const activeRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);

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

  const emit = () => {
    if (running) return;
    setRunning(true);
    const start = performance.now();
    const prefersReduced = document.documentElement.dataset.motion === "reduced";
    const duration = prefersReduced ? 1 : 2600;

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

  return (
    <div className="event-bus">
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
            className={`bus-node ${activeIndex === index ? "active" : ""}`}
            transform={`translate(${geometry.positions[index]}, ${geometry.lineY})`}
            tabIndex={0}
            focusable="true"
            aria-label={`${node.label}: ${node.tooltip}`}
          >
            <title>{node.tooltip}</title>
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
    </div>
  );
};

export default EventBus;
