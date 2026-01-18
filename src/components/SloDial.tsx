import { useEffect, useRef, useState } from "react";

const SloDial = () => {
  const target = 0.999;
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      document.documentElement.dataset.motion === "reduced" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setProgress(target);
      return;
    }

    const start = performance.now();
    const duration = 1200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(target * t);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="slo-dial" aria-label="SLO target 99.9 percent">
      <svg viewBox="0 0 120 120" role="img" aria-hidden="true">
        <circle className="slo-track" cx="60" cy="60" r={radius} />
        <circle
          className="slo-progress"
          cx="60"
          cy="60"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
        />
      </svg>
      <div className="slo-label">
        <div className="eyebrow">SLO target</div>
        <strong>99.9%</strong>
      </div>
    </div>
  );
};

export default SloDial;
