import { useEffect, useState } from "react";

const STORAGE_KEY = "shayan-hints-seen";

const KeyboardHints = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="keyboard-hints" role="status" aria-live="polite">
      <div className="keyboard-hints-title">Quick shortcuts</div>
      <div className="keyboard-hints-body">Press Ctrl + K for the command palette.</div>
      <div className="keyboard-hints-body">Type D L Q for a surprise.</div>
      <button className="cta-secondary" type="button" onClick={dismiss}>
        Got it
      </button>
    </div>
  );
};

export default KeyboardHints;
