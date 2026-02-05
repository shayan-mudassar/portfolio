import { useEffect, useState } from "react";

type LedgerEvent = {
  id: string;
  time: string;
  name: string;
  tag: string;
};

const eventNames = [
  { name: "payment_webhook_failed", tag: "webhook" },
  { name: "incident_acknowledged", tag: "incident" },
  { name: "retry_scheduled", tag: "retry" },
  { name: "dlq_replay_started", tag: "dlq" },
  { name: "queue_backlog_spike", tag: "queue" },
  { name: "latency_spike_detected", tag: "slo" },
  { name: "audit_log_written", tag: "audit" },
  { name: "canary_deploy_started", tag: "deploy" },
];

const formatTime = () =>
  new Date().toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const makeEvent = (): LedgerEvent => {
  const pick = eventNames[Math.floor(Math.random() * eventNames.length)];
  return {
    id: Math.random().toString(16).slice(2, 10),
    time: formatTime(),
    name: pick.name,
    tag: pick.tag,
  };
};

const EventLedger = () => {
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const updatePreference = () => {
      const reduced =
        document.documentElement.dataset.motion === "reduced" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setPrefersReduced(reduced);
    };

    updatePreference();
    const handler = () => updatePreference();
    window.addEventListener("site:settings", handler);
    return () => window.removeEventListener("site:settings", handler);
  }, []);

  useEffect(() => {
    setEvents([makeEvent(), makeEvent(), makeEvent()]);
    if (prefersReduced) {
      return;
    }

    const interval = window.setInterval(
      () => {
        setEvents((prev) => [makeEvent(), ...prev].slice(0, 6));
      },
      2600
    );
    return () => window.clearInterval(interval);
  }, [prefersReduced]);

  return (
    <div className={`ledger ${prefersReduced ? "ledger--static" : ""}`} aria-live="polite">
      <div className="ledger-title">Event ledger</div>
      <div className="ledger-stream">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="ledger-item"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span className="ledger-time">{event.time}</span>
            <span className="ledger-name">{event.name}</span>
            <span className="ledger-tag">{event.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventLedger;
