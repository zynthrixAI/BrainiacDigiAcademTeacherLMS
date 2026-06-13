"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  widthClassName?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  widthClassName = "max-w-md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        className={`no-scrollbar relative z-10 max-h-[90vh] w-full ${widthClassName} overflow-y-auto rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="m-0 font-display text-lg font-extrabold text-ink">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-[#fafaf9]"
          >
            <CloseIcon size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
