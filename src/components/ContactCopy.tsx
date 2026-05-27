import { useState } from "react";
import { showToast } from "./ToastHost";

type ContactCopyProps = {
  email: string;
  phone?: string;
};

const ContactCopy = ({ email, phone }: ContactCopyProps) => {
  const [status, setStatus] = useState("");

  const copyValue = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(`${label} copied`);
      setStatus(`${label} copied`);
      window.setTimeout(() => setStatus(""), 2000);
    } catch {
      showToast("Copy failed");
      setStatus("Copy failed");
      window.setTimeout(() => setStatus(""), 2000);
    }
  };

  const phoneHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : "";

  return (
    <div className="contact-card">
      <div className="contact-methods">
        <div className="contact-method">
          <strong>Email</strong>
          <div>{email}</div>
        </div>
        {phone ? (
          <div className="contact-method">
            <strong>Phone</strong>
            <div>{phone}</div>
          </div>
        ) : null}
      </div>
      <div className="contact-actions">
        <button className="cta-secondary" type="button" onClick={() => copyValue(email, "Email")}>
          Copy email
        </button>
        <a className="cta-secondary" href={`mailto:${email}`}>
          Email me
        </a>
        {phone ? (
          <>
            <button className="cta-secondary" type="button" onClick={() => copyValue(phone, "Phone")}>
              Copy phone
            </button>
            <a className="cta-secondary" href={phoneHref}>
              Call
            </a>
          </>
        ) : null}
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
