"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type AccountConfirmDialogProps = {
  open: boolean;
  title: string;
  titleId: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  loadingLabel?: string;
  variant?: "danger" | "default";
  iconClassName?: string;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
  footer?: ReactNode;
};

export default function AccountConfirmDialog({
  open,
  title,
  titleId,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  loading = false,
  loadingLabel,
  variant = "default",
  iconClassName = "fa-regular fa-circle-question",
  error = null,
  onClose,
  onConfirm,
  footer,
}: AccountConfirmDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [loading, onClose, open]);

  if (!open) {
    return null;
  }

  const confirmButtonClass =
    variant === "danger"
      ? "rbt-btn rbt-btn-sm rbt-bg-color-danger shadow-none"
      : "rbt-btn rbt-btn-sm";

  return createPortal(
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="managed-bs-modal-layer is-open"
      role="dialog"
      style={{ zIndex: 1055 }}
    >
      <div
        aria-hidden
        className="modal-backdrop fade show"
        onClick={loading ? undefined : onClose}
      />
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <button
                aria-label="Close"
                className="rbt-round-btn rbt-modal-dis-btn ms-auto"
                disabled={loading}
                onClick={onClose}
                type="button"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body pt-0 text-center">
              <div
                className={`mx-auto mb--16 d-flex align-items-center justify-content-center rbt-round-btn${
                  variant === "danger" ? " rbt-bg-color-danger opacity-75" : ""
                }`}
              >
                <i className={iconClassName} />
              </div>
              <h5 className="rbt-title mb--12" id={titleId}>
                {title}
              </h5>
              <div className="b3 mb--0">{description}</div>
              {error ? (
                <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
              ) : null}
              {footer ?? (
                <div className="d-flex justify-content-center rbt-gap--16 mt--24">
                  <button
                    className="rbt-btn rbt-btn-sm rbt-btn-secondary"
                    disabled={loading}
                    onClick={onClose}
                    type="button"
                  >
                    {cancelLabel}
                  </button>
                  <button
                    className={confirmButtonClass}
                    disabled={loading}
                    onClick={onConfirm}
                    type="button"
                  >
                    {loading
                      ? (loadingLabel ?? `${confirmLabel}…`)
                      : confirmLabel}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
