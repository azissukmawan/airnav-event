import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  isOpen = false,
  onClose = () => {},
  title = "",
  children,
  footer = null,
  size = "md", // "sm" | "md" | "lg"
  closeOnOverlayClick = true,
  showCloseButton = true,
}) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    // disable page scroll when modal open
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    // focus close button (or panel) when opened
    if (isOpen) {
      // give small delay to ensure element exists in DOM
      setTimeout(() => {
        closeBtnRef.current?.focus();
        if (!closeBtnRef.current) panelRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass =
    size === "sm" ? "max-w-md" : size === "lg" ? "max-w-4xl" : "max-w-2xl";

  const handleOverlayMouseDown = (e) => {
    if (!closeOnOverlayClick) return;
    if (e.target === overlayRef.current) onClose();
  };

  const modalHtml = (
    <div
      ref={overlayRef}
      onMouseDown={handleOverlayMouseDown}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      aria-hidden={false}
    >
      {/* backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

      {/* panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        tabIndex={-1}
        className={`relative z-10 w-full ${sizeClass} bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-200 divide-y divide-gray-200`}
      >
        {/* header (no extra border so divide-y provides single divider) */}
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {showCloseButton && (
            <button
              ref={closeBtnRef}
              onClick={onClose}
              aria-label="Close dialog"
              className="ml-4 -mr-2 p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* body */}
        <div className="px-6 py-5 text-sm text-gray-700">{children}</div>

        {/* footer */}
        {footer && (
          <div className="px-6 py-4 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalHtml, document.body);
}
