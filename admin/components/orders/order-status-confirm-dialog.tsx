"use client";

import type { OrderStatus } from "@platform/shared";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function formatOrderStatusLabel(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

type OrderStatusConfirmDialogProps = {
  customerLabel?: string;
  loading?: boolean;
  nextStatus: OrderStatus | null;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  orderLabel: string;
  previousStatus: OrderStatus | null;
};

export function OrderStatusConfirmDialog({
  customerLabel,
  loading = false,
  nextStatus,
  onClose,
  onConfirm,
  open,
  orderLabel,
  previousStatus,
}: OrderStatusConfirmDialogProps) {
  const fromLabel =
    previousStatus !== null ? formatOrderStatusLabel(previousStatus) : "";
  const toLabel = nextStatus !== null ? formatOrderStatusLabel(nextStatus) : "";

  return (
    <ConfirmDialog
      cancelLabel="Cancel"
      confirmLabel="Update status"
      description={
        nextStatus && previousStatus ? (
          <>
            Change order <strong>{orderLabel}</strong>
            {customerLabel ? (
              <>
                {" "}
                for <strong>{customerLabel}</strong>
              </>
            ) : null}{" "}
            from <strong>{fromLabel}</strong> to <strong>{toLabel}</strong>?
            {nextStatus === "cancelled" ? (
              <>
                {" "}
                Cancelling restores product stock for this order&apos;s items.
              </>
            ) : null}
          </>
        ) : null
      }
      loading={loading}
      loadingLabel="Updating…"
      onClose={() => {
        if (!loading) {
          onClose();
        }
      }}
      onConfirm={onConfirm}
      open={open}
      title="Update order status?"
      titleId="order-status-confirm-title"
      variant={nextStatus === "cancelled" ? "danger" : "default"}
    />
  );
}
