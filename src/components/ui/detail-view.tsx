import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import * as React from "react";
import { Badge } from "./badge";

// ─── DetailSection ────────────────────────────────────────────────────────────

interface DetailSectionProps extends React.ComponentProps<"div"> {
  title?: string;
  action?: React.ReactNode;
}

function DetailSection({
  title,
  action,
  className,
  children,
  ...props
}: DetailSectionProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-background",
        className,
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 bg-white">
          {title && (
            <span className="text-sm font-medium text-foreground">{title}</span>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── DetailGrid ───────────────────────────────────────────────────────────────

function DetailGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-6 gap-y-5",
        className,
      )}
      {...props}
    />
  );
}

// ─── DetailItem ───────────────────────────────────────────────────────────────

interface DetailItemProps extends React.ComponentProps<"div"> {
  label: string;
  span?: "full" | 2 | 3;
}

function DetailItem({
  label,
  span,
  className,
  children,
  ...props
}: DetailItemProps) {
  return (
    <div
      data-slot="detail-item"
      className={cn(
        "flex min-w-0 flex-col gap-1",
        span === "full" && "col-span-full",
        span === 2 && "col-span-2",
        span === 3 && "col-span-3",
        className,
      )}
      {...props}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="text-sm leading-snug text-foreground">
        {children ?? <span className="text-muted-foreground/40">—</span>}
      </div>
    </div>
  );
}

// ─── DetailBoolean ────────────────────────────────────────────────────────────

function DetailBoolean({
  value,
  className,
}: {
  value: boolean;
  className?: string;
}) {
  return (
    <Badge variant={value ? "default" : "outline"} className={className}>
      {value ? "Yes" : "No"}
    </Badge>
  );
}

// ─── DetailList ───────────────────────────────────────────────────────────────

interface DetailListProps<T> extends Omit<React.ComponentProps<"div">, "children"> {
  title?: string;
  action?: React.ReactNode;
  values?: T[];
  renderItem?: (item: T, index: number) => React.ReactNode;
  empty?: React.ReactNode;
  direction?: "row" | "column";
}

function DetailList<T = string>({
  title,
  action,
  values,
  renderItem,
  empty,
  direction = "column",
  className,
  ...props
}: DetailListProps<T>) {
  const hasItems = values && values.length > 0;

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between">
          {title && (
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </span>
          )}
          {action}
        </div>
      )}
      <div
        className={cn(
          "flex gap-2",
          direction === "column" ? "flex-col" : "flex-wrap",
        )}
      >
        {hasItems
          ? values.map((item, index) =>
              renderItem ? (
                renderItem(item, index)
              ) : (
                <DetailListItem key={index}>{String(item)}</DetailListItem>
              ),
            )
          : (empty ?? (
              <span className="text-sm text-muted-foreground/40">None</span>
            ))}
      </div>
    </div>
  );
}

// ─── DetailListItem ───────────────────────────────────────────────────────────

function DetailListItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="detail-list-item"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg bg px-3 py-3 text-xs font-medium text-foreground ring-1 ring-foreground/10",
        className,
      )}
      {...props}
    />
  );
}

// ─── DetailFieldRow ───────────────────────────────────────────────────────────
//
// Horizontal label → value row with a bottom divider (removed on last child).
// Use inside a <DetailSection> for key/value panels.
//
// @example
// <DetailSection title="Shipping">
//   <DetailFieldRow label="Carrier">FedEx</DetailFieldRow>
//   <DetailFieldRow label="Tracking">
//     <span className="font-mono text-xs text-blue-600">7489234823</span>
//   </DetailFieldRow>
// </DetailSection>

interface DetailFieldRowProps extends React.ComponentProps<"div"> {
  label: string;
}

function DetailFieldRow({
  label,
  className,
  children,
  ...props
}: DetailFieldRowProps) {
  return (
    <div
      data-slot="detail-field-row"
      className={cn(
        "flex items-center justify-between gap-4 border-b border-border/60 py-2.5 last:border-b-0",
        className,
      )}
      {...props}
    >
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="text-right text-sm font-medium text-foreground">
        {children ?? <span className="text-muted-foreground/40">—</span>}
      </div>
    </div>
  );
}

// ─── DetailStatsBar ───────────────────────────────────────────────────────────
//
// A 4-up grid of metric cards. Each card has a muted background, small
// uppercase label, large primary number, and optional sub-text + progress bar.
//
// @example
// <DetailStatsBar>
//   <DetailStatCard label="Expected" value={590} sub="units across 3 SKUs" />
//   <DetailStatCard label="Received" value={420} sub="71% of expected" progress={71} />
//   <DetailStatCard label="Rejected" value={20} valueClassName="text-destructive" sub="3.4% of received" />
//   <DetailStatCard label="Boxes" value={24} sub="4 pallets" />
// </DetailStatsBar>

function DetailStatsBar({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="detail-stats-bar"
      className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── DetailStatCard ───────────────────────────────────────────────────────────

interface DetailStatCardProps extends React.ComponentProps<"div"> {
  /** Uppercase label above the number */
  label: string;
  /** The primary metric — shown large */
  value: React.ReactNode;
  /** Small text below the number */
  sub?: string;
  /**
   * When provided (0–100), renders a thin progress bar beneath the value.
   * Useful for "received / expected" ratios.
   */
  progress?: number;
  /** Extra className applied to the value element only */
  valueClassName?: string;
  icon?: LucideIcon;
}


function DetailStatCard({
  label,
  value,
  sub,
  progress,
  valueClassName,
  className,
  icon: Icon,
  ...props
}: DetailStatCardProps) {
  return (
    <div
      data-slot="detail-stat-card"
      className={cn(
        "relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border/50 bg-muted/40 px-4 py-4 backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>

          <span
            className={cn(
              "text-2xl font-semibold leading-tight tabular-nums text-foreground",
              valueClassName,
            )}
          >
            {value}
          </span>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/80 shadow-sm ring-1 ring-border/50">
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        </div>
      </div>

      {/* Sub text */}
      {sub && (
        <span className="text-xs text-muted-foreground">
          {sub}
        </span>
      )}
    </div>
  );
}
// ─── DetailTable ──────────────────────────────────────────────────────────────
//
// A lightweight full-width table with a muted header row.
// Pass column definitions and row data; renders a consistent striped-on-hover table.
//
// @example
// <DetailTable
//   columns={[
//     { key: "name", label: "Product", className: "flex-[2]" },
//     { key: "sku",  label: "SKU" },
//     { key: "qty",  label: "Qty", align: "right" },
//   ]}
//   rows={items.map((item) => ({
//     key: item.id,
//     cells: {
//       name: <span className="font-medium">{item.name}</span>,
//       sku:  item.sku,
//       qty:  item.qty,
//     },
//   }))}
// />

interface DetailTableColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  /** Tailwind flex/width class, e.g. "flex-[2]" or "w-24" */
  className?: string;
}

interface DetailTableRow {
  key: string;
  cells: Record<string, React.ReactNode>;
}

interface DetailTableProps extends React.ComponentProps<"div"> {
  columns: DetailTableColumn[];
  rows: DetailTableRow[];
  empty?: React.ReactNode;
}

function DetailTable({
  columns,
  rows,
  empty,
  className,
  ...props
}: DetailTableProps) {
  const alignClass: Record<string, string> = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  };

  return (
    <div data-slot="detail-table" className={cn("w-full", className)} {...props}>
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border/60 bg-muted/40 px-4 py-2">
        {columns.map((col) => (
          <span
            key={col.key}
            className={cn(
              "flex-1 text-xs font-medium uppercase tracking-wide text-muted-foreground",
              alignClass[col.align ?? "left"],
              col.className,
            )}
          >
            {col.label}
          </span>
        ))}
      </div>
      {/* Rows */}
      {rows.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground/40">
          {empty ?? "No data."}
        </div>
      ) : (
        rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center gap-4 border-b border-border/60 px-4 py-3 last:border-b-0 hover:bg-muted/20"
          >
            {columns.map((col) => (
              <div
                key={col.key}
                className={cn(
                  "flex-1 text-sm text-foreground",
                  alignClass[col.align ?? "left"],
                  col.className,
                )}
              >
                {row.cells[col.key] ?? (
                  <span className="text-muted-foreground/40">—</span>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  DetailBoolean, DetailFieldRow, DetailGrid,
  DetailItem, DetailList,
  DetailListItem, DetailSection, DetailStatCard, DetailStatsBar, DetailTable
};
export type {
  DetailFieldRowProps, DetailListProps, DetailStatCardProps,
  DetailTableColumn, DetailTableProps, DetailTableRow
};

// ─── DetailBoxGrid ────────────────────────────────────────────────────────────
//
// A responsive grid of box cards. Each card shows box number, barcode, status
// badge, and a compact list of contents (product name + quantity).
// Overflow beyond `maxVisible` collapses into a "+ N more" placeholder card.
//
// @example
// <DetailBoxGrid
//   boxes={plan.boxes}
//   maxVisible={8}
//   renderContents={(box) =>
//     box.items.map((item) => ({
//       id: item.id,
//       label: item.product_name,
//       quantity: item.quantity,
//     }))
//   }
// />

interface DetailBoxGridItem {
  id: string;
  label: string;
  quantity: number;
}

interface DetailBoxGridBox {
  id: string;
  box_number: number | string;
  barcode?: string | null;
  is_received: boolean;
}

interface DetailBoxGridProps<TBox extends DetailBoxGridBox> extends React.ComponentProps<"div"> {
  boxes: TBox[];
  renderContents: (box: TBox) => DetailBoxGridItem[];
}

function DetailBoxGrid<TBox extends DetailBoxGridBox>({
  boxes,
  renderContents,
  className,
  ...props
}: DetailBoxGridProps<TBox>) {
  return (
    <div
      data-slot="detail-box-grid"
      className={cn(
        "flex flex-row gap-3 overflow-x-auto pb-2",
        className,
      )}
      {...props}
    >
      {boxes.map((box) => {
        const contents = renderContents(box);
        return (
          <div
            key={box.id}
            className="overflow-hidden rounded-lg border border-border/60 bg-background shrink-0 w-55"
          >
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-muted-foreground"
                  aria-hidden="true"
                >
                  <path d="M16.5 9.4 7.55 4.24" />
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                </svg>
                <span className="text-xs font-medium truncate">
                  #{box.box_number}
                </span>
              </div>
              <Badge
                variant={box.is_received ? "default" : "outline"}
                className="text-[10px] px-1.5 py-0 h-4 shrink-0"
              >
                {box.is_received ? "Received" : "Pending"}
              </Badge>
            </div>

            {/* Card body */}
            <div className="px-3 py-2 flex flex-col gap-1.5">
              {box.barcode && (
                <span className="font-mono text-[10px] text-muted-foreground/60 truncate">
                  {box.barcode}
                </span>
              )}
              {contents.length === 0 ? (
                <span className="text-xs text-muted-foreground/40">Empty</span>
              ) : (
                contents.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-xs text-muted-foreground truncate">
                      {item.label}
                    </span>
                    <span className="text-xs font-medium tabular-nums shrink-0">
                      × {item.quantity.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}

    </div>
  );
}

export { DetailBoxGrid };
export type { DetailBoxGridBox, DetailBoxGridItem };
