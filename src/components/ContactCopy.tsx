import { useState } from "react";

type ContactCopyProps = {
  email: string;
};

const ContactCopy = ({ email }: ContactCopyProps) => {
  const [status, setStatus] = useState("Copy email");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Copied to clipboard");
      window.setTimeout(() => setStatus("Copy email"), 2000);
    } catch {
      setStatus("Copy failed");
      window.setTimeout(() => setStatus("Copy email"), 2000);
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
      <div className="copy-status" aria-live="polite">
        {status}
      </div>
    </div>
  );
};

export default ContactCopy;
