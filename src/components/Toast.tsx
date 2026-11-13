import { useEffect, useState } from "react";

// Terminal-style toast, bottom right. Announced politely, gone after 2.4s.
// `showToast` can be called from anywhere (components or plain modules).
type Listener = (msg: { id: number; text: string } | null) => void;

let listener: Listener | null = null;
let nextId = 1;
let clearTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(text: string, ms = 2400) {
  clearTimeout(clearTimer);
  listener?.({ id: nextId++, text });
  clearTimer = setTimeout(() => listener?.(null), ms);
}

export default function ToastHost() {
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    // On dismiss the toast plays a short exit before it unmounts.
    listener = (next) => {
      clearTimeout(exitTimer);
      if (next) {
        setLeaving(false);
        setMsg(next);
      } else {
        setLeaving(true);
        exitTimer = setTimeout(() => setMsg(null), 160);
      }
    };
    return () => {
      listener = null;
      clearTimeout(clearTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <div className="toast-host" aria-live="polite" role="status">
      {msg && (
        <p key={msg.id} className="toast" data-leaving={leaving ? "true" : undefined}>
          <span className="toast-prompt" aria-hidden="true">
            &gt;
          </span>
          {msg.text}
        </p>
      )}
    </div>
  );
}
