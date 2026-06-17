"use client";

import * as React from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterOption = {
  label: string;
  value: string;
};

type CheckboxFilter = {
  name: string;
  label: string;
  type: "checkbox";
  options: FilterOption[];
};

type DropdownFilter = {
  name: string;
  label: string;
  type: "dropdown";
  placeholder?: string;
  options: FilterOption[];
};

type RadioFilter = {
  name: string;
  label: string;
  type: "radio";
  options: FilterOption[];
};

export type FilterConfig = CheckboxFilter | DropdownFilter | RadioFilter;

/**
 * FilterState maps each filter's `name` key to:
 *  - checkbox  → string[]   (selected values)
 *  - dropdown  → string     (selected value, or "" for none)
 *  - radio     → string     (selected value, or "" for none)
 */
export type FilterState = Record<string, string | string[]>;

/** Build a blank FilterState from a list of filter configs */
export function createInitialFilterState(filters: FilterConfig[]): FilterState {
  return Object.fromEntries(
    filters.map((f) => [f.name, f.type === "checkbox" ? [] : ""]),
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Checkbox group
function CheckboxGroup({
  filter,
  value,
  onChange,
}: {
  filter: CheckboxFilter;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div className="flex flex-col gap-1.5 pt-1">
      {filter.options.map((opt) => {
        const checked = value.includes(opt.value);
        return (
          <label
            key={opt.value}
            className={cn(
              "flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer text-sm select-none",
              "transition-colors duration-100",
              checked
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted/60 text-foreground/80",
            )}
          >
            <span
              className={cn(
                "w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-all duration-150",
                checked
                  ? "bg-primary border-primary"
                  : "border-border bg-background",
              )}
              aria-hidden
            >
              {checked && (
                <svg
                  viewBox="0 0 10 8"
                  className="w-2.5 h-2.5 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    d="M1 4l2.5 2.5L9 1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() => toggle(opt.value)}
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}

// Dropdown (native-style custom select)
function DropdownGroup({
  filter,
  value,
  onChange,
}: {
  filter: DropdownFilter;
  value: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = filter.options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative mt-1">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm border",
          "transition-all duration-100",
          open
            ? "border-primary ring-2 ring-primary/20 bg-background"
            : "border-border bg-muted/30 hover:bg-muted/60 text-foreground/80",
        )}
      >
        <span
          className={selected ? "text-foreground" : "text-muted-foreground"}
        >
          {selected?.label ?? filter.placeholder ?? "Select…"}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 w-full rounded-md border border-border bg-popover shadow-md",
            "animate-in fade-in-0 zoom-in-95 duration-100",
          )}
        >
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted/60 border-b border-border/50"
            >
              <X className="h-3 w-3" /> Clear selection
            </button>
          )}
          {filter.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors duration-75",
                opt.value === value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/60 text-foreground/80",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Radio group
function RadioGroup({
  filter,
  value,
  onChange,
}: {
  filter: RadioFilter;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 pt-1">
      {filter.options.map((opt) => {
        const checked = value === opt.value;
        return (
          <label
            key={opt.value}
            className={cn(
              "flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer text-sm select-none",
              "transition-colors duration-100",
              checked
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted/60 text-foreground/80",
            )}
          >
            <span
              className={cn(
                "w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-150",
                checked ? "border-primary" : "border-border bg-background",
              )}
              aria-hidden
            >
              {checked && (
                <span className="w-2 h-2 rounded-full bg-primary block" />
              )}
            </span>
            <input
              type="radio"
              className="sr-only"
              checked={checked}
              onChange={() => onChange(opt.value)}
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}

// ─── FilterItem (collapsible) ─────────────────────────────────────────────────

function FilterItem({
  filter,
  state,
  onChange,
}: {
  filter: FilterConfig;
  state: FilterState;
  onChange: (name: string, value: string | string[]) => void;
}) {
  const [open, setOpen] = React.useState(true);

  const rawValue = state[filter.name];

  // Derive active count for badge
  const activeCount =
    filter.type === "checkbox"
      ? (rawValue as string[]).length
      : rawValue
        ? 1
        : 0;

  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-2 px-1 py-3 text-left group"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {filter.label}
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold leading-none">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-96 opacity-100 pb-3" : "max-h-0 opacity-0",
        )}
      >
        {filter.type === "checkbox" && (
          <CheckboxGroup
            filter={filter}
            value={rawValue as string[]}
            onChange={(v) => onChange(filter.name, v)}
          />
        )}
        {filter.type === "dropdown" && (
          <DropdownGroup
            filter={filter}
            value={rawValue as string}
            onChange={(v) => onChange(filter.name, v)}
          />
        )}
        {filter.type === "radio" && (
          <RadioGroup
            filter={filter}
            value={rawValue as string}
            onChange={(v) => onChange(filter.name, v)}
          />
        )}
      </div>
    </div>
  );
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────

type FilterPanelProps = {
  filters: FilterConfig[];
  state: FilterState;
  onChange: (state: FilterState) => void;
  className?: string;
  title?: string;
};

export function FilterPanel({
  filters,
  state,
  onChange,
  className,
  title = "Filters",
}: FilterPanelProps) {
  const handleChange = (name: string, value: string | string[]) => {
    onChange({ ...state, [name]: value });
  };

  // Count total active filters
  const totalActive = Object.values(state).reduce<number>((acc, v) => {
    if (Array.isArray(v)) return acc + v.length;
    return acc + (v ? 1 : 0);
  }, 0);

  const handleClearAll = () => {
    onChange(createInitialFilterState(filters));
  };

  return (
    <div
      className={cn(
        "w-64 shrink-0 rounded-xl border border-border bg-card flex flex-col self-start",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {totalActive > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold leading-none">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Filter items */}
      <div className="px-4">
        {filters.map((filter) => (
          <FilterItem
            key={filter.name}
            filter={filter}
            state={state}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Hook ───────────────────────────────────────────────────────

/**
 * Convenience hook that owns the filter state.
 *
 * @example
 * const { state, onChange, reset } = useFilterState(filters);
 * <FilterPanel filters={filters} state={state} onChange={onChange} />
 */
export function useFilterState(filters: FilterConfig[]) {
  const [state, setState] = React.useState<FilterState>(() =>
    createInitialFilterState(filters),
  );

  const reset = React.useCallback(
    () => setState(createInitialFilterState(filters)),
    [filters],
  );

  return { state, onChange: setState, reset };
}
