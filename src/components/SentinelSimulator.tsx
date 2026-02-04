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

type Postmortem = {
  summary: string;
  timeline: { time: string; detail: string }[];
  factors: string[];
};

const postmortems: Record<FailureMode, Postmortem> = {
  Timeout: {
    summary: "Downstream API exceeded timeout budget during webhook processing.",
    timeline: [
      { time: "+0s", detail: "Webhook received and correlation ID assigned." },
      { time: "+0.6s", detail: "Idempotency lock acquired, processing started." },
      { time: "+1.2s", detail: "Attempt #1 timed out, retry queued." },
      { time: "+2.2s", detail: "Attempt #2 timed out, message moved to DLQ." },
    ],
    factors: [
      "Downstream dependency latency exceeded budget.",
      "Retry window too short for the slow path.",
      "Backlog pressure increased queue wait time.",
    ],
  },
  "Bad payload": {
    summary: "Schema drift caused repeated validation failures on payloads.",
    timeline: [
      { time: "+0s", detail: "Webhook received and payload parsing started." },
      { time: "+0.6s", detail: "Idempotency lock acquired, validation enforced." },
      { time: "+1.2s", detail: "Attempt #1 rejected, retry queued." },
      { time: "+2.2s", detail: "Attempt #2 rejected, message moved to DLQ." },
    ],
    factors: [
      "Upstream schema changed without version coordination.",
      "Required fields missing in payload.",
      "Validation errors not auto-corrected or quarantined early.",
    ],
  },
  "Rate limit": {
    summary: "Burst traffic exceeded rate limits and triggered repeated backoff.",
    timeline: [
      { time: "+0s", detail: "Webhook received, rate limit window hit." },
      { time: "+0.6s", detail: "Idempotency lock acquired, backoff started." },
      { time: "+1.2s", detail: "Attempt #1 rate limited, retry queued." },
      { time: "+2.2s", detail: "Attempt #2 rate limited, message moved to DLQ." },
    ],
    factors: [
      "Burst traffic exceeded per-tenant quotas.",
      "Adaptive concurrency controls not aggressive enough.",
      "Cold start amplification increased retry collisions.",
    ],
  },
};

const preventativeActions = [
  "Idempotency keys to prevent duplicate writes.",
  "Schema validation gates with versioned contracts.",
  "Adaptive backoff and jitter on retries.",
  "DLQ replay tooling with audit trails.",
  "Alerts on latency, retries, and DLQ growth.",
];

const SentinelSimulator = () => {
  const [status, setStatus] = useState<"idle" | "running" | "dlq" | "replayed">("idle");
  const [failureMode, setFailureMode] = useState<FailureMode>("Timeout");
  const [logs, setLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({ latency: 120, errorRate: 0.02 });
  const [latencyHistory, setLatencyHistory] = useState<number[]>([120, 160, 140]);
  const [errorHistory, setErrorHistory] = useState<number[]>([0.02, 0.04, 0.03]);
  const [correlationId, setCorrelationId] = useState(randomId("cor"));
  const [idempotencyKey, setIdempotencyKey] = useState(randomId("idem"));
  const [postmortem, setPostmortem] = useState<Postmortem | null>(null);
  const timersRef = useRef<number[]>([]);
  const showMedia = false;
  const base = import.meta.env.BASE_URL;
  const screenshotSrc = `${base}assets/projects/sentinel-placeholder.svg`;

  const statusLabel = useMemo(() => {
    if (status === "dlq") return "Routed to DLQ";
    if (status === "replayed") return "Replay succeeded";
    if (status === "running") return "Processing";
    return "Idle";
  }, [status]);

  const postmortemTimeline = useMemo(() => {
    if (!postmortem) return [];
    if (status === "replayed") {
      return [
        ...postmortem.timeline,
        { time: "+3.8s", detail: "Replay succeeded and incident resolved." },
      ];
    }
    return postmortem.timeline;
  }, [postmortem, status]);

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
    setPostmortem(postmortems[failureMode]);
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
    <div className="project-block" id="project-sentinel" data-project-card="sentinel">
      <div className="project-header">
        <div>
          <h3>Sentinel Incident Platform</h3>
          <p className="project-tagline">Incident workflow coordination with reliable event processing.</p>
        </div>
        <div className="project-actions">
          <a
            href="https://github.com/shayan-mudassar/sentinel-incident-platform"
            target="_blank"
            rel="noreferrer"
            aria-label="Sentinel Incident Platform on GitHub"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className={`project-grid${showMedia ? "" : " project-grid--solo"}`}>
        {showMedia ? (
          <figure className="project-media">
            {/* TODO: Replace with a real Sentinel screenshot in public/assets/projects/. */}
            <img
              src={screenshotSrc}
              alt="Sentinel incident console screenshot"
              loading="lazy"
              decoding="async"
              width="1200"
              height="675"
            />
            <figcaption>Replace with a real screenshot of the incident console.</figcaption>
          </figure>
        ) : null}
        <div className="case-study">
          <div className="project-snapshot">
            <div className="eyebrow">Architecture snapshot</div>
            <svg viewBox="0 0 520 120" role="img" aria-label="Sentinel architecture snapshot">
              <defs>
                <marker
                  id="snapArrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)" />
                </marker>
              </defs>
              <line className="snapshot-link" x1="96" y1="40" x2="126" y2="40" markerEnd="url(#snapArrow)" />
              <line className="snapshot-link" x1="202" y1="40" x2="232" y2="40" markerEnd="url(#snapArrow)" />
              <line className="snapshot-link" x1="308" y1="40" x2="338" y2="40" markerEnd="url(#snapArrow)" />
              <line className="snapshot-link" x1="414" y1="40" x2="444" y2="40" markerEnd="url(#snapArrow)" />

              <rect className="snapshot-node" x="10" y="20" width="86" height="40" rx="10" />
              <text className="snapshot-label" x="53" y="45" textAnchor="middle">
                Webhook
              </text>

              <rect className="snapshot-node" x="126" y="20" width="86" height="40" rx="10" />
              <text className="snapshot-label" x="169" y="45" textAnchor="middle">
                Gateway
              </text>

              <rect className="snapshot-node" x="232" y="20" width="86" height="40" rx="10" />
              <text className="snapshot-label" x="275" y="45" textAnchor="middle">
                Queue
              </text>

              <rect className="snapshot-node" x="338" y="20" width="86" height="40" rx="10" />
              <text className="snapshot-label" x="381" y="45" textAnchor="middle">
                Worker
              </text>

              <rect className="snapshot-node snapshot-node--accent" x="444" y="20" width="66" height="40" rx="10" />
              <text className="snapshot-label" x="477" y="45" textAnchor="middle">
                DLQ
              </text>
            </svg>
            <div className="arch-hint">Webhook intake flows through retries, DLQ, and replay tooling.</div>
          </div>
          <div>
            <h4>Problem</h4>
            <p>
              Incident workflows break when payment webhooks fail or arrive twice, making recovery slow and hard to
              audit.
            </p>
          </div>
          <div>
            <h4>Approach</h4>
            <ul>
              <li>Designed event-driven intake with correlation IDs and idempotency at the edge.</li>
              <li>Modeled incident state changes with an outbox and DLQ for replayable recovery.</li>
              <li>Instrumented traces, metrics, and logs to tie failures to user impact.</li>
            </ul>
          </div>
          <div>
            <h4>Outcome</h4>
            <ul>
              <li>Delivered resilient incident workflows with safe retries and replay tooling.</li>
              <li>Made failures traceable across services for faster triage.</li>
            </ul>
          </div>
          <div>
            <h4>How users interact with it</h4>
            <p>Operators trigger incidents, review retries, and replay failed events from a shared console.</p>
          </div>
          <div className="breaks-first">
            <strong>What breaks first:</strong> downstream webhook providers stall, pushing retries into the DLQ and
            stretching recovery timelines.
          </div>
          <div className="accordion">
            <details>
              <summary>Tradeoffs</summary>
              <ul className="tradeoff-list">
                <li>
                  <strong>Chose:</strong> event-driven intake with idempotency + DLQ replay.
                </li>
                <li>
                  <strong>Rejected:</strong> synchronous processing with manual incident recovery.
                </li>
                <li>
                  <strong>Why:</strong> needed auditability and safe retries under real traffic spikes.
                </li>
              </ul>
            </details>
          </div>
        </div>
      </div>

      <div className="console">
        <div className="console-top">
          <div>
            <div className="pill">Incident console</div>
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
            <summary>Key engineering decisions</summary>
            <ul>
              <li>Idempotency keys gate webhook retries to prevent double writes.</li>
              <li>Outbox events keep data changes and emissions consistent.</li>
              <li>DLQ + replay tooling isolates failures without losing events.</li>
              <li>Correlation IDs flow through logs, traces, and alerts.</li>
            </ul>
          </details>
        </div>
      </div>

      {postmortem && logs.length > 0 ? (
        <div className="postmortem" aria-live="polite">
          <div className="postmortem-header">
            <div>
              <div className="eyebrow">Postmortem</div>
              <strong>{postmortem.summary}</strong>
            </div>
            <div className="pill">{failureMode} scenario</div>
          </div>
          <div className="postmortem-grid">
            <div>
              <div className="postmortem-title">Timeline</div>
              <ul className="postmortem-timeline">
                {postmortemTimeline.map((item) => (
                  <li key={item.time}>
                    <span className="postmortem-time">{item.time}</span>
                    <span>{item.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="postmortem-title">Contributing factors</div>
              <ul className="postmortem-list">
                {postmortem.factors.map((factor) => (
                  <li key={factor}>{factor}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <div className="postmortem-title">Preventative actions</div>
            <ul className="postmortem-list">
              {preventativeActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SentinelSimulator;
