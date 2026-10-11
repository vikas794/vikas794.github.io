import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

// One tap copies the address. The label confirms for two seconds and is
// announced politely. If the clipboard is unavailable nothing breaks: the
// mailto link next to it still works.
export default function CopyEmail({ email, className = "btn btn-primary" }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the mailto link is the fallback */
    }
  }

  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
