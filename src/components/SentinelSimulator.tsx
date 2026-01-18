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

type FailureMode = "Timeout" | "Bad payload" | "Rate limit";

const failureModes: FailureMode[] = ["Timeout", "Bad payload", "Rate limit"];

const scenarios: Record<
  FailureMode,
  {
    start: string;
    attempt1: string;
    attempt2: string;
    metrics: {
      initial: [number, number];
      locked: [number, number];
      retry: [number, number];
      dlq: [number, number];
    };
  }
> = {
  Timeout: {
    start: "Event received: payment_webhook_failed",
    attempt1: "Attempt #1 timed out -> scheduling retry (1.2s)",
    attempt2: "Attempt #2 timed out -> routed to DLQ",
    metrics: {
      initial: [140, 0.04],
      locked: [220, 0.08],
      retry: [480, 0.18],
      dlq: [820, 0.32],
    },
  },
  "Bad payload": {
    start: "Event received: payment_webhook_failed",
    attempt1: "Attempt #1 rejected -> payload validation failed",
    attempt2: "Attempt #2 rejected -> routed to DLQ",
    metrics: {
      initial: [160, 0.06],
      locked: [260, 0.12],
      retry: [420, 0.22],
      dlq: [650, 0.3],
    },
  },
  "Rate limit": {
    start: "Event received: payment_webhook_failed",
    attempt1: "Attempt #1 rate limited -> backing off (1.2s)",
    attempt2: "Attempt #2 rate limited -> routed to DLQ",
    metrics: {
      initial: [180, 0.05],
      locked: [300, 0.1],
      retry: [520, 0.2],
      dlq: [760, 0.28],
    },
  },
};

const SentinelSimulator = () => {
  const [status, setStatus] = useState<"idle" | "running" | "dlq" | "replayed">("idle");
  const [failureMode, setFailureMode] = useState<FailureMode>("Timeout");
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
    const scenario = scenarios[failureMode];
    const correlation = randomId("cor");
    const idem = randomId("idem");
    setCorrelationId(correlation);
    setIdempotencyKey(idem);

    pushLog(`${scenario.start} (${correlation})`);
    updateMetrics(...scenario.metrics.initial);

    timersRef.current.push(
      window.setTimeout(() => {
        pushLog(`Idempotency lock acquired (${idem})`);
        updateMetrics(...scenario.metrics.locked);
      }, delay(600))
    );

    timersRef.current.push(
      window.setTimeout(() => {
        pushLog(scenario.attempt1);
        updateMetrics(...scenario.metrics.retry);
      }, delay(1200))
    );

    timersRef.current.push(
      window.setTimeout(() => {
        pushLog(scenario.attempt2);
        updateMetrics(...scenario.metrics.dlq);
        setStatus("dlq");
      }, delay(2200))
    );
  };

  const replay = () => {
    clearTimers();
    setStatus("running");
    pushLog(`Replay requested after ${failureMode.toLowerCase()} failure`);
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
          <div className="failure-toggle" role="radiogroup" aria-label="Failure injection mode">
            {failureModes.map((mode) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={failureMode === mode}
                className={failureMode === mode ? "active" : ""}
                onClick={() => setFailureMode(mode)}
                disabled={status === "running"}
              >
                {mode}
              </button>
            ))}
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
