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
  const showMedia = false;
  const base = import.meta.env.BASE_URL;
  const screenshotSrc = `${base}assets/projects/anomaly-placeholder.svg`;

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
    <div className="project-block" id="project-anomaly" data-project-card="anomaly">
      <div className="project-header">
        <div>
          <h3>Network Anomaly Detection</h3>
          <p className="project-tagline">Detect abnormal behavior from logs without labeled data.</p>
        </div>
        <div className="project-actions">
          <a
            href="https://github.com/shayan-mudassar/network-anomaly-detection"
            target="_blank"
            rel="noreferrer"
            aria-label="Network Anomaly Detection on GitHub"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className={`project-grid${showMedia ? "" : " project-grid--solo"}`}>
        {showMedia ? (
          <figure className="project-media">
            {/* TODO: Replace with a real Anomaly Detection screenshot in public/assets/projects/. */}
            <img
              src={screenshotSrc}
              alt="Network anomaly detection screenshot"
              loading="lazy"
              decoding="async"
              width="1200"
              height="675"
            />
            <figcaption>Replace with a real screenshot of the anomaly explorer.</figcaption>
          </figure>
        ) : null}
        <div className="case-study">
          <div className="project-snapshot">
            <div className="eyebrow">Architecture snapshot</div>
            <svg viewBox="0 0 600 120" role="img" aria-label="Anomaly detection architecture snapshot">
              <defs>
                <marker
                  id="snapArrowAnomaly"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)" />
                </marker>
              </defs>
              <line className="snapshot-link" x1="130" y1="40" x2="170" y2="40" markerEnd="url(#snapArrowAnomaly)" />
              <line className="snapshot-link" x1="290" y1="40" x2="330" y2="40" markerEnd="url(#snapArrowAnomaly)" />
              <line className="snapshot-link" x1="450" y1="40" x2="490" y2="40" markerEnd="url(#snapArrowAnomaly)" />

              <rect className="snapshot-node" x="20" y="20" width="110" height="40" rx="10" />
              <text className="snapshot-label" x="75" y="45" textAnchor="middle">
                Logs
              </text>

              <rect className="snapshot-node" x="170" y="20" width="120" height="40" rx="10" />
              <text className="snapshot-label" x="230" y="45" textAnchor="middle">
                Features
              </text>

              <rect className="snapshot-node" x="330" y="20" width="120" height="40" rx="10" />
              <text className="snapshot-label" x="390" y="45" textAnchor="middle">
                Model
              </text>

              <rect className="snapshot-node snapshot-node--accent" x="490" y="20" width="90" height="40" rx="10" />
              <text className="snapshot-label" x="535" y="45" textAnchor="middle">
                Alerts
              </text>
            </svg>
            <div className="arch-hint">Feature scoring feeds the model and raises alerts at tuned thresholds.</div>
          </div>
          <div>
            <h4>Problem</h4>
            <p>Ops teams need to detect abnormal network behavior from logs without labeled incident data.</p>
          </div>
          <div>
            <h4>Approach</h4>
            <ul>
              <li>Built a feature pipeline and synthetic evaluation set to test sensitivity.</li>
              <li>Compared Isolation Forest vs One-Class SVM for unsupervised detection.</li>
              <li>Exposed contamination and threshold controls to make tradeoffs explicit.</li>
            </ul>
          </div>
          <div>
            <h4>Outcome</h4>
            <ul>
              <li>Delivered actionable anomaly signals for monitoring use cases.</li>
              <li>Made model tradeoffs transparent for stakeholders.</li>
            </ul>
          </div>
          <div>
            <h4>How users interact with it</h4>
            <p>Analysts tune thresholds, compare models, and review highlighted anomalies in a time-series view.</p>
          </div>
          <div className="breaks-first">
            <strong>What breaks first:</strong> contamination drift pushes false positives before thresholds are
            recalibrated.
          </div>
          <div className="accordion">
            <details>
              <summary>Tradeoffs</summary>
              <ul className="tradeoff-list">
                <li>
                  <strong>Chose:</strong> transparent model toggles with operator-tuned thresholds.
                </li>
                <li>
                  <strong>Rejected:</strong> black-box auto-thresholding without operator context.
                </li>
                <li>
                  <strong>Why:</strong> ops teams needed explainable tradeoffs between noise and misses.
                </li>
              </ul>
            </details>
          </div>
        </div>
      </div>

      <div className="anomaly-panel">
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

        <div className="accordion">
          <details>
            <summary>Key engineering decisions</summary>
            <ul>
              <li>Unsupervised models avoid labeled data bottlenecks.</li>
              <li>Standardized distance scoring keeps thresholds consistent across runs.</li>
              <li>UI surfaces precision and recall to guide operations teams.</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
};

export default AnomalyExplorer;
