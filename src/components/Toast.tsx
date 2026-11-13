import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

// Terminal-style toast, bottom right. Announced politely, gone after 2.4s,
// or swiped down (the way it entered). `showToast` can be called from anywhere
// (components or plain modules).
type Listener = (msg: { id: number; text: string } | null) => void;

let listener: Listener | null = null;
let nextId = 1;
let clearTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(text: string, ms = 2400) {
  clearTimeout(clearTimer);
  listener?.({ id: nextId++, text });
  clearTimer = setTimeout(() => listener?.(null), ms);
}

function dismissToast() {
  clearTimeout(clearTimer);
  listener?.(null);
}

// Dismiss on distance OR a quick flick.
const DISMISS_OFFSET = 40;
const DISMISS_VELOCITY = 500;

export default function ToastHost() {
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null);
  const [leaving, setLeaving] = useState(false);
  const reduce = useReducedMotion();

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
        <motion.p
          key={msg.id}
          className="toast"
          // Tracks the finger 1:1; a small rubber band upward, never a hard stop.
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.1, bottom: 0.6 }}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY) dismissToast();
          }}
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={leaving ? { opacity: 0, y: reduce ? 0 : 24 } : { opacity: 1, y: 0 }}
          transition={
            leaving
              ? { duration: 0.16, ease: [0.22, 1, 0.36, 1] }
              : { type: "spring", duration: 0.35, bounce: 0.1 }
          }
        >
          <span className="toast-prompt" aria-hidden="true">
            &gt;
          </span>
          {msg.text}
        </motion.p>
      )}
    </div>
  );
}
