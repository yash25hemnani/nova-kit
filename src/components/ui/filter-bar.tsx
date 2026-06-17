"use client";

import * as React from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type FilterConfig,
  type FilterState,
  createInitialFilterState,
} from "./filter-panel"; // re-uses your existing types

// ─── Pill dropdown ────────────────────────────────────────────────────────────

function PillDropdown({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig;
  value: string | string[];
  onChange: (v: string | string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Derive label + active count
  const activeCount =
    filter.type === "checkbox"
      ? (value as string[]).length
      : value
        ? 1
        : 0;

  const pillLabel = React.useMemo(() => {
    if (filter.type === "checkbox") return filter.label;
    if (!value) return filter.label;
    return filter.options.find((o) => o.value === value)?.label ?? filter.label;
  }, [filter, value]);

  const toggleCheckbox = (v: string) => {
    const arr = value as string[];
    onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  const pickSingle = (v: string) => {
    onChange(value === v ? "" : v);
    if (filter.type !== "checkbox") setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-sm select-none transition-all duration-100",
          activeCount > 0
            ? "border-primary/60 bg-primary/10 text-primary"
            : "border-border bg-muted/30 text-foreground/80 hover:bg-muted/60",
        )}
      >
        <span>{pillLabel}</span>
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold leading-none">
            {activeCount}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1.5 left-0 min-w-40 rounded-xl border border-border bg-popover shadow-md py-1 animate-in fade-in-0 zoom-in-95 duration-100">
          {filter.options.map((opt) => {
            const selected =
              filter.type === "checkbox"
                ? (value as string[]).includes(opt.value)
                : value === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  filter.type === "checkbox"
                    ? toggleCheckbox(opt.value)
                    : pickSingle(opt.value)
                }
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-1.5 text-sm transition-colors duration-75",
                  selected
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted/60",
                )}
              >
                {/* indicator */}
                {filter.type === "checkbox" ? (
                  <span
                    className={cn(
                      "w-3.5 h-3.5 shrink-0 rounded border flex items-center justify-center transition-all duration-150",
                      selected
                        ? "bg-primary border-primary"
                        : "border-border bg-background",
                    )}
                    aria-hidden
                  >
                    {selected && (
                      <svg
                        viewBox="0 0 10 8"
                        className="w-2 h-2 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          d="M1 4l2.5 2.5L9 1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "w-3.5 h-3.5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-150",
                      selected ? "border-primary" : "border-border",
                    )}
                    aria-hidden
                  >
                    {selected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary block" />
                    )}
                  </span>
                )}
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── FilterBar ──────────────────────────────────────────────────────────

type FilterBarProps = {
  filters: FilterConfig[];
  state: FilterState;
  onChange: (state: FilterState) => void;
  className?: string;
};

export function FilterBar({
  filters,
  state,
  onChange,
  className,
}: FilterBarProps) {
  const handleChange = (name: string, value: string | string[]) => {
    onChange({ ...state, [name]: value });
  };

  const totalActive = Object.values(state).reduce<number>((acc, v) => {
    if (Array.isArray(v)) return acc + v.length;
    return acc + (v ? 1 : 0);
  }, 0);

  const handleClearAll = () => onChange(createInitialFilterState(filters));

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 flex-wrap",
        "bg-card px-3 py-1.5 ",
        className,
      )}
    >
      {/* Icon */}
      <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

      {/* Divider */}
      <div className="w-px h-5 bg-border shrink-0" />

      {/* Pills */}
      {filters.map((filter) => (
        <PillDropdown
          key={filter.name}
          filter={filter}
          value={state[filter.name]}
          onChange={(v) => handleChange(filter.name, v)}
        />
      ))}

      {/* Clear all */}
      {totalActive > 0 && (
        <>
          <div className="w-px h-5 bg-border shrink-0" />
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 h-8 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        </>
      )}
    </div>
  );
}