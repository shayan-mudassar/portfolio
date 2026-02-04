import { useState } from "react";
import { showToast } from "./ToastHost";

type ContactCopyProps = {
  email: string;
};

const ContactCopy = ({ email }: ContactCopyProps) => {
  const [status, setStatus] = useState("");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied");
      setStatus("Email copied");
      window.setTimeout(() => setStatus(""), 2000);
    } catch {
      showToast("Copy failed");
      setStatus("Copy failed");
      window.setTimeout(() => setStatus(""), 2000);
    }
  };

  return (
    <div className="contact-card">
      <div>
        <strong>Email</strong>
        <div>{email}</div>
      </div>
      <div className="contact-actions">
        <button className="cta-secondary" type="button" onClick={copyEmail}>
          Copy email
        </button>
        <a className="cta-secondary" href={`mailto:${email}`}>
          Email me
        </a>
      </div>
      {status ? (
        <div className="copy-status sr-only" aria-live="polite">
          {status}
        </div>
      ) : null}
    </div>
  );
};

export default ContactCopy;
