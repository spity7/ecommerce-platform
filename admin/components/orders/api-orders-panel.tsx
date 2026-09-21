"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchOrders, platformApi } from "@platform/api-client";
import type { OrderStatus } from "@platform/shared";
import {
  type EntityColumn,
  EntityTable,
} from "@/components/admin/entity-table";
import { OrderStatusConfirmDialog } from "@/components/orders/order-status-confirm-dialog";
import { OrderStatusFilterSelect } from "@/components/orders/order-status-filter-select";
import { OrderStatusSelect } from "@/components/orders/order-status-select";
import { OrdersTableSkeleton } from "@/components/orders/orders-table-skeleton";
import {
  mapOrderDtoToApiOrderRow,
  type ApiOrderRow,
} from "@/lib/mappers/orders";
import { pathBuilders } from "@/config/routes";
import {
  buildOrderTotalFilterGroup,
  ORDER_STATUS_FILTER_OPTIONS,
} from "@/lib/orders-list-filters";

function resolveCustomerColumnWidth(viewportWidth: number): string {
  if (viewportWidth < 768) {
    return "108px";
  }
  if (viewportWidth < 1024) {
    return "200px";
  }
  return "240px";
}

function resolveStatusColumnWidth(viewportWidth: number): string {
  return viewportWidth < 768 ? "128px" : "168px";
}

function useOrdersTableViewport(): {
  customerColumnWidth: string;
  isMobile: boolean;
  statusColumnWidth: string;
} {
  const [customerColumnWidth, setCustomerColumnWidth] = useState("240px");
  const [statusColumnWidth, setStatusColumnWidth] = useState("168px");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function syncViewport() {
      const width = window.innerWidth;
      setCustomerColumnWidth(resolveCustomerColumnWidth(width));
      setStatusColumnWidth(resolveStatusColumnWidth(width));
      setIsMobile(width < 768);
    }

    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  return { customerColumnWidth, isMobile, statusColumnWidth };
}

export function ApiOrdersPanel() {
  const [orders, setOrders] = useState<ApiOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusConfirm, setStatusConfirm] = useState<{
    nextStatus: OrderStatus;
    order: ApiOrderRow;
  } | null>(null);
  const { customerColumnWidth, isMobile, statusColumnWidth } =
    useOrdersTableViewport();

  const loadOrders = useCallback(async () => {
    setError(null);
    try {
      const response = await fetchOrders();
      setOrders(response.data.map(mapOrderDtoToApiOrderRow));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load orders from the API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  function requestStatusChange(order: ApiOrderRow, status: OrderStatus) {
    if (status === order.apiStatus) {
      return;
    }
    setStatusConfirm({ nextStatus: status, order });
  }

  async function confirmStatusChange() {
    if (!statusConfirm) {
      return;
    }

    const { nextStatus, order } = statusConfirm;
    setUpdatingOrderId(order.apiId);
    setError(null);
    try {
      await platformApi.updateOrder(order.apiId, { status: nextStatus });
      setStatusConfirm(null);
      await loadOrders();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  const columns: EntityColumn<ApiOrderRow>[] = useMemo(() => {
    const orderIdColumn: EntityColumn<ApiOrderRow> = {
      cellClassName: "whitespace-nowrap",
      colWidth: "108px",
      headerTruncate: false,
      key: "order",
      label: "Order ID",
      render: (order) => (
        <span className="font-semibold text-brand-600">#{order.id}</span>
      ),
      sortValue: (order) => order.id,
    };

    return [
      ...(isMobile ? [] : [orderIdColumn]),
      {
        cellClassName: "min-w-0",
        colWidth: customerColumnWidth,
        hideable: true,
        key: "customer",
        label: "Customer",
        render: (order) => (
          <div className="min-w-0">
            <span className="block truncate font-semibold text-ink-900">
              {order.customer}
            </span>
            {!isMobile && order.customerEmail ? (
              <p className="truncate text-[13px] text-ink-500">
                {order.customerEmail}
              </p>
            ) : null}
          </div>
        ),
        sortValue: (order) => order.customer,
      },
      {
        cellClassName: "whitespace-nowrap",
        colWidth: statusColumnWidth,
        headerTruncate: false,
        hideable: true,
        key: "status",
        label: "Status",
        render: (order) => (
          <OrderStatusSelect
            ariaLabel={`Status for order ${order.id}`}
            className="w-full min-w-0"
            disabled={
              updatingOrderId === order.apiId ||
              statusConfirm?.order.apiId === order.apiId
            }
            onValueChange={(status) => requestStatusChange(order, status)}
            value={order.apiStatus}
          />
        ),
        sortValue: (order) => order.apiStatus,
      },
      {
        cellClassName: "whitespace-nowrap tabular-nums",
        colWidth: "100px",
        headerTruncate: false,
        hideable: true,
        key: "total",
        label: "Total",
        render: (order) => (
          <span className="font-semibold text-ink-900">{order.total}</span>
        ),
        sortValue: (order) => order.totalAmount,
      },
      {
        cellClassName: "whitespace-nowrap",
        colWidth: "148px",
        headerTruncate: false,
        hideable: true,
        key: "added",
        label: "Date Added",
        render: (order) => order.added,
        sortValue: (order) => order.added,
      },
      {
        cellClassName: "whitespace-nowrap",
        colWidth: "148px",
        headerTruncate: false,
        hideable: true,
        key: "modified",
        label: "Date Modified",
        render: (order) => order.modified,
        sortValue: (order) => order.modified,
      },
    ];
  }, [
    customerColumnWidth,
    isMobile,
    statusColumnWidth,
    statusConfirm,
    updatingOrderId,
  ]);

  const totalFilterGroup = useMemo(
    () => ({
      ...buildOrderTotalFilterGroup(orders),
      className: "min-w-0 w-full md:w-[200px]",
    }),
    [orders]
  );

  if (loading) {
    return <OrdersTableSkeleton hideOrderColumn={isMobile} />;
  }

  if (error) {
    return (
      <div className="rounded-base border border-warning-200 bg-warning-50 px-4 py-3 text-[14px] text-warning-700">
        {error} Ensure the API server is running and you are signed in as admin.
      </div>
    );
  }

  return (
    <>
      <EntityTable
        columns={columns}
        deleteMessage="Orders cannot be deleted from the admin UI yet."
        editActionAriaLabel={(order) => `View order ${order.id}`}
        editActionIcon="eye"
        editHref={(order) => pathBuilders.orderDetail(order.apiId)}
        filterGroups={[totalFilterGroup]}
        filterOptions={[...ORDER_STATUS_FILTER_OPTIONS]}
        filterOptionsFirst
        items={orders}
        deleteButtonClassName="max-md:w-auto md:ml-auto"
        renderFilterSelect={({ onValueChange, value }) => (
          <OrderStatusFilterSelect
            className="min-w-0 w-full md:w-[180px]"
            onValueChange={onValueChange}
            value={value}
          />
        )}
        searchFieldClassName="md:w-[340px]"
        searchLabel="Search orders"
        searchPlaceholder="Search order ID or customer"
        searchText={(order) =>
          `${order.id} ${order.customer} ${order.total} ${order.apiStatus}`
        }
        singularName="order"
        tableClassName={
          isMobile
            ? "min-w-[620px] md:min-w-0 lg:min-w-[1040px]"
            : "min-w-0 lg:min-w-[1040px]"
        }
      />
      <OrderStatusConfirmDialog
        customerLabel={statusConfirm?.order.customer}
        loading={Boolean(
          statusConfirm && updatingOrderId === statusConfirm.order.apiId
        )}
        nextStatus={statusConfirm?.nextStatus ?? null}
        onClose={() => setStatusConfirm(null)}
        onConfirm={() => void confirmStatusChange()}
        open={statusConfirm !== null}
        orderLabel={`#${statusConfirm?.order.id ?? ""}`}
        previousStatus={statusConfirm?.order.apiStatus ?? null}
      />
    </>
  );
}
