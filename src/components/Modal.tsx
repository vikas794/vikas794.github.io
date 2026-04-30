import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  ariaLabel,
}: ModalProps) {
  return (
    <>
      <div
        className={`modal-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>
      <div
        className={`modal ${isOpen ? "active" : ""} ${className}`.trim()}
        role="dialog"
        aria-hidden={!isOpen}
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </>
  );
}
