import { useEffect, useMemo, useState } from "react";
import { profile } from "../data/profile";
import { useSiteSettings } from "../utils/useSiteSettings";

const ArchitectureMap = () => {
  const { settings } = useSiteSettings();
  const isArchMode = settings?.arch === "on";
  const nodes = profile.architectureNodes;
  const [selectedId, setSelectedId] = useState<string | null>(nodes[0]?.id ?? null);

  const layout = useMemo(() => {
    const startX = 70;
    const endX = 830;
    const lineY = 140;
    const labelY = 135;
    const positions = nodes.map((_, index) =>
      startX + (index / (nodes.length - 1)) * (endX - startX)
    );
    return { startX, endX, lineY, labelY, positions };
  }, [nodes]);

  useEffect(() => {
    if (!isArchMode) {
      setSelectedId(null);
    } else if (!selectedId && nodes[0]) {
      setSelectedId(nodes[0].id);
    }
  }, [isArchMode, nodes, selectedId]);

  const selectedNode = nodes.find((node) => node.id === selectedId) ?? null;

  const onSelect = (id: string) => {
    if (!isArchMode) return;
    setSelectedId(id);
  };

  return (
    <div className="arch-map" id="architecture-map">
      <svg viewBox="0 0 900 360" role="img" aria-label="Event-driven system map">
        <defs>
          <linearGradient id="archLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path d="M70 140 L830 140" stroke="url(#archLine)" strokeWidth="3" fill="none" />
        <path d="M220 140 L220 230" stroke="var(--mono)" strokeDasharray="6 6" />
        <path d="M520 140 L520 230" stroke="var(--mono)" strokeDasharray="6 6" />

        {nodes.map((node, index) => (
          <g
            key={node.id}
            className={`arch-node-button ${selectedId === node.id ? "active" : ""}`}
            transform={`translate(${layout.positions[index]}, ${layout.lineY})`}
            role={isArchMode ? "button" : undefined}
            tabIndex={isArchMode ? 0 : -1}
            aria-label={`${node.label}. ${node.detail}`}
            onClick={() => onSelect(node.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(node.id);
              }
            }}
          >
            <rect className="arch-node-box" x={-70} y={-30} width="140" height="60" rx="12" />
            <text className="arch-node-text" x={0} y={layout.labelY - layout.lineY} textAnchor="middle">
              {node.label}
            </text>
          </g>
        ))}

        <g className="arch-project">
          <rect className="arch-project-box" x="160" y="230" width="120" height="50" rx="12" />
          <text className="arch-project-text" x="220" y="260" textAnchor="middle" fontSize="12">
            Sentinel
          </text>
        </g>
        <g className="arch-project">
          <rect className="arch-project-box" x="460" y="230" width="140" height="50" rx="12" />
          <text className="arch-project-text" x="530" y="260" textAnchor="middle" fontSize="12">
            Anomaly Lab
          </text>
        </g>
      </svg>
      <div className="arch-legend">
        <span>
          <span className="arch-dot"></span> Projects mapped onto the flow
        </span>
        <span>Toggle Architecture Mode to emphasize the diagram.</span>
      </div>
      {isArchMode ? (
        <div className="arch-panel" role="status">
          <div className="arch-panel-title">Focused node</div>
          {selectedNode ? (
            <div>
              <strong>{selectedNode.label}</strong>
              <p>{selectedNode.detail}</p>
            </div>
          ) : (
            <p>Select a node to see what ships here.</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ArchitectureMap;
