"use client";

import { useOptionalBusy } from "./busy-provider.js";

type BusyViewportOverlayProps = {
  className?: string;
  label?: string;
  zIndex?: number;
};

const SPIN_KEYFRAMES = `@keyframes platform-busy-spin {
  to {
    transform: rotate(360deg);
  }
}`;

export function BusyViewportOverlay({
  className,
  label = "Please wait…",
  zIndex = 45,
}: BusyViewportOverlayProps) {
  const context = useOptionalBusy();

  if (!context?.busy) {
    return null;
  }

  return (
    <>
      <style>{SPIN_KEYFRAMES}</style>
      <div
        aria-busy="true"
        aria-live="polite"
        className={className}
        role="status"
        style={{
          position: "fixed",
          inset: 0,
          zIndex,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          cursor: "wait",
          background: "rgba(17, 17, 17, 0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            minWidth: 200,
            maxWidth: "min(100%, 280px)",
            padding: "24px 28px",
            borderRadius: 12,
            background: "#ffffff",
            boxShadow:
              "0 10px 35px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)",
            textAlign: "center",
          }}
        >
          <div
            aria-hidden
            style={{
              width: 36,
              height: 36,
              border: "3px solid #e6e6e6",
              borderTopColor: "#215ada",
              borderRadius: "50%",
              animation: "platform-busy-spin 0.75s linear infinite",
            }}
          />
          <p
            style={{
              margin: 0,
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1.4,
              color: "#222222",
            }}
          >
            {label}
          </p>
        </div>
      </div>
    </>
  );
}
