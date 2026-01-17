import { useMemo, useState } from "react";

type Model = "Isolation Forest" | "One-Class SVM";

type Point = {
  index: number;
  value: number;
  actual: boolean;
};

const createSeries = (): Point[] => {
  const anomalies = new Set([10, 24, 37, 52]);
  return Array.from({ length: 60 }, (_, index) => {
    const base = Math.sin(index / 4) * 1.2 + Math.cos(index / 10) * 0.6;
    const noise = (index % 7) * 0.04;
    const spike = anomalies.has(index) ? 2.4 : 0;
    return {
      index,
      value: base + noise + spike,
      actual: anomalies.has(index),
    };
  });
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const AnomalyExplorer = () => {
  const [model, setModel] = useState<Model>("Isolation Forest");
  const [contamination, setContamination] = useState(0.08);
  const [threshold, setThreshold] = useState(2.1);

  const series = useMemo(() => createSeries(), []);

  const analysis = useMemo(() => {
    const values = series.map((point) => point.value);
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance =
      values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance) || 1;

    const scores = values.map((value) => Math.abs(value - mean) / std);
    const sensitivity = model === "Isolation Forest" ? 1 + contamination * 1.5 : 1 + contamination;

    const predicted = scores.map((score) => score * sensitivity >= threshold);

    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;

    series.forEach((point, index) => {
      if (point.actual && predicted[index]) truePositives += 1;
      if (!point.actual && predicted[index]) falsePositives += 1;
      if (point.actual && !predicted[index]) falseNegatives += 1;
    });

    const precision = truePositives / (truePositives + falsePositives || 1);
    const recall = truePositives / (truePositives + falseNegatives || 1);

    return {
      predicted,
      precision,
      recall,
    };
  }, [series, contamination, threshold, model]);

  const chart = useMemo(() => {
    const values = series.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = series
      .map((point, index) => {
        const x = (index / (series.length - 1)) * 100;
        const y = 90 - ((point.value - min) / range) * 70;
        return `${x},${y}`;
      })
      .join(" ");

    return { points, min, max };
  }, [series]);

  return (
    <div className="anomaly-panel">
      <div className="project-header">
        <h3>Network Anomaly Detection</h3>
        <div className="project-actions">
          <a href="https://github.com/shayan-mudassar/network-anomaly-detection" target="_blank" rel="noreferrer">
            View repo
          </a>
        </div>
      </div>
      <p className="arch-hint">
        Toggle between models and tune contamination vs threshold to see precision/recall tradeoffs.
      </p>

      <div className="model-toggle" role="tablist" aria-label="Model selector">
        {["Isolation Forest", "One-Class SVM"].map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={model === option}
            className={model === option ? "active" : ""}
            onClick={() => setModel(option as Model)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="anomaly-controls">
        <label>
          Contamination ({(contamination * 100).toFixed(0)}%)
          <input
            type="range"
            min={0.02}
            max={0.2}
            step={0.01}
            value={contamination}
            onChange={(event) => setContamination(parseFloat(event.target.value))}
          />
        </label>
        <label>
          Threshold ({threshold.toFixed(1)} sigma)
          <input
            type="range"
            min={1.2}
            max={3.4}
            step={0.1}
            value={threshold}
            onChange={(event) => setThreshold(parseFloat(event.target.value))}
          />
        </label>
      </div>

      <svg className="anomaly-chart" viewBox="0 0 100 100" role="img" aria-label="Synthetic time series">
        <polyline
          fill="none"
          stroke="var(--accent-3)"
          strokeWidth="1.8"
          points={chart.points}
        />
        {series.map((point, index) => {
          const x = (index / (series.length - 1)) * 100;
          const y = 90 - ((point.value - chart.min) / (chart.max - chart.min || 1)) * 70;
          const predicted = analysis.predicted[index];
          return (
            <circle
              key={point.index}
              cx={x}
              cy={y}
              r={point.actual ? 3.4 : 2.4}
              fill={point.actual ? "var(--accent-2)" : predicted ? "var(--accent)" : "var(--line)"}
              opacity={predicted || point.actual ? 0.95 : 0.5}
            />
          );
        })}
      </svg>
      <div className="arch-legend">
        <span>
          <span className="legend-dot" style={{ background: "var(--accent)" }}></span> Predicted
        </span>
        <span>
          <span className="legend-dot" style={{ background: "var(--accent-2)" }}></span> Actual anomalies
        </span>
      </div>

      <div className="tradeoff">
        <div>
          <div className="eyebrow">Precision</div>
          <div className="arch-hint">{(analysis.precision * 100).toFixed(0)}%</div>
          <div className="tradeoff-bar">
            <span style={{ width: `${clamp(analysis.precision * 100, 2, 100)}%` }}></span>
          </div>
        </div>
        <div>
          <div className="eyebrow">Recall</div>
          <div className="arch-hint">{(analysis.recall * 100).toFixed(0)}%</div>
          <div className="tradeoff-bar">
            <span style={{ width: `${clamp(analysis.recall * 100, 2, 100)}%` }}></span>
          </div>
        </div>
      </div>

      <div className="arch-hint">
        {model === "Isolation Forest"
          ? "Isolation Forest expects a contamination ratio and flags outliers by density splits."
          : "One-Class SVM draws a boundary around normal behavior and flags points outside it."}
      </div>
    </div>
  );
};

export default AnomalyExplorer;
