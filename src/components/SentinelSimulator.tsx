import { useEffect, useMemo, useRef, useState } from "react";

const randomId = (prefix: string) => {
  const seed = Math.random().toString(16).slice(2, 8);
  return `${prefix}-${seed}`;
};

const formatTime = () =>
  new Date().toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const Sparkline = ({ values, accent }: { values: number[]; accent: string }) => {
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * 100;
      const y = 36 - (value / max) * 30;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="sparkline" viewBox="0 0 100 40" aria-hidden="true">
      <polyline
        fill="none"
        stroke={accent}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SentinelSimulator = () => {
  const [status, setStatus] = useState<"idle" | "running" | "dlq" | "replayed">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({ latency: 120, errorRate: 0.02 });
  const [latencyHistory, setLatencyHistory] = useState<number[]>([120, 160, 140]);
  const [errorHistory, setErrorHistory] = useState<number[]>([0.02, 0.04, 0.03]);
  const [correlationId, setCorrelationId] = useState(randomId("cor"));
  const [idempotencyKey, setIdempotencyKey] = useState(randomId("idem"));
  const timersRef = useRef<number[]>([]);

  const statusLabel = useMemo(() => {
    if (status === "dlq") return "Routed to DLQ";
    if (status === "replayed") return "Replay succeeded";
    if (status === "running") return "Processing";
    return "Idle";
  }, [status]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const pushLog = (message: string) => {
    setLogs((prev) => [`${formatTime()} - ${message}`, ...prev].slice(0, 8));
  };

  const updateMetrics = (latency: number, errorRate: number) => {
    setMetrics({ latency, errorRate });
    setLatencyHistory((prev) => [...prev.slice(-9), latency]);
    setErrorHistory((prev) => [...prev.slice(-9), errorRate]);
  };

  const runSimulation = () => {
    clearTimers();
    setStatus("running");
    setLogs([]);
    const prefersReduced = document.documentElement.dataset.motion === "reduced";
    const delay = (ms: number) => Math.max(20, ms * (prefersReduced ? 0.15 : 1));
    const correlation = randomId("cor");
    const idem = randomId("idem");
    setCorrelationId(correlation);
    setIdempotencyKey(idem);

    pushLog(`Event received: payment_webhook_failed (${correlation})`);
    updateMetrics(140, 0.04);

    timersRef.current.push(
      window.setTimeout(() => {
        pushLog(`Idempotency lock acquired (${idem})`);
        updateMetrics(220, 0.08);
      }, delay(600))
    );

    timersRef.current.push(
      window.setTimeout(() => {
        pushLog("Attempt #1 failed -> scheduling retry (1.2s)");
        updateMetrics(480, 0.18);
      }, delay(1200))
    );

    timersRef.current.push(
      window.setTimeout(() => {
        pushLog("Attempt #2 failed -> routed to DLQ");
        updateMetrics(820, 0.32);
        setStatus("dlq");
      }, delay(2200))
    );
  };

  const replay = () => {
    clearTimers();
    setStatus("running");
    pushLog("Replay requested from DLQ");
    updateMetrics(520, 0.18);
    const prefersReduced = document.documentElement.dataset.motion === "reduced";
    const delay = (ms: number) => Math.max(20, ms * (prefersReduced ? 0.15 : 1));

    timersRef.current.push(
      window.setTimeout(() => {
        pushLog("Idempotency key accepted, processing replay");
        updateMetrics(380, 0.11);
      }, delay(700))
    );

    timersRef.current.push(
      window.setTimeout(() => {
        pushLog("Webhook delivered, incident resolved");
        updateMetrics(260, 0.05);
        setStatus("replayed");
      }, delay(1600))
    );
  };

  return (
    <div className="console">
      <div className="console-top">
        <div>
          <div className="pill">Incident console</div>
          <div className="project-header">
            <h3>Sentinel Incident Platform</h3>
            <div className="project-actions">
              <a
                href="https://github.com/shayan-mudassar/sentinel-incident-platform"
                target="_blank"
                rel="noreferrer"
              >
                View repo
              </a>
            </div>
          </div>
          <div className="arch-mode-indicator">
            Status: <strong>{statusLabel}</strong>
          </div>
        </div>
        <div className="project-actions">
          <button
            className="cta-primary"
            type="button"
            onClick={runSimulation}
            disabled={status === "running"}
          >
            Trigger payment_webhook_failed
          </button>
          <button className="cta-secondary" type="button" onClick={replay} disabled={status !== "dlq"}>
            Replay
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="eyebrow">Latency</div>
          <div className="metric-value">{Math.round(metrics.latency)} ms</div>
          <Sparkline values={latencyHistory} accent="var(--accent)" />
        </div>
        <div className="metric-card">
          <div className="eyebrow">Error rate</div>
          <div className="metric-value">{(metrics.errorRate * 100).toFixed(1)}%</div>
          <Sparkline values={errorHistory} accent="var(--accent-2)" />
        </div>
      </div>

      <div className="console-log" aria-live="polite">
        {logs.length === 0 && <div>No incidents yet. Trigger an event to start.</div>}
        {logs.map((log) => (
          <div key={log}>{log}</div>
        ))}
      </div>

      <div className="arch-hint">
        Correlation ID: <strong>{correlationId}</strong> - Idempotency key: <strong>{idempotencyKey}</strong>
      </div>

      <div className="accordion">
        <details>
          <summary>Design choices</summary>
          <ul>
            <li>Idempotency keys prevent double writes from repeated webhooks.</li>
            <li>Outbox pattern ensures database writes publish reliably to the bus.</li>
            <li>DLQ + replay tooling keeps failures safe and observable.</li>
            <li>Structured logging and tracing keep correlation IDs in every event.</li>
          </ul>
        </details>
      </div>
    </div>
  );
};

export default SentinelSimulator;
