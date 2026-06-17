"use client";

import * as React from "react";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Loader2 } from "lucide-react";

import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectOption = {
  label: string;
  value: string;
};

type StaticSource = {
  options: SelectOption[];
  onSearch?: never;
};

type AsyncSource = {
  onSearch: (query: string) => Promise<SelectOption[]>;
  /**
   * Seed options so pre-selected values display labels immediately (e.g. pass
   * your prefetched list in edit mode).
   */
  options?: SelectOption[];
};

type FormSelectMultipleProps<T extends FieldValues> = (
  | StaticSource
  | AsyncSource
) & {
  name: Path<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  emptyMessage?: string;
  /** Debounce delay in ms for async calls (default: 300) */
  debounce?: number;
  disabled?: boolean;
};

// ─── Inner combobox ───────────────────────────────────────────────────────────

type InnerComboboxProps = {
  selectedValues: string[];
  onChange: (vals: string[]) => void;
  onBlur: () => void;
  disabled?: boolean;
  triggerRef: React.Ref<HTMLInputElement>;
  placeholder?: string;
  emptyMessage?: string;
  // Pulled apart so nothing unstable enters effect deps.
  isStatic: boolean;
  staticOptions: SelectOption[];
  seedOptions: SelectOption[] | undefined;
  onSearch: AsyncSource["onSearch"] | undefined;
  debounce: number;
  invalid?: boolean;
};

function InnerCombobox({
  selectedValues,
  onChange,
  onBlur,
  disabled,
  triggerRef,
  placeholder = "Select options...",
  emptyMessage = "No options found.",
  isStatic,
  staticOptions,
  seedOptions,
  onSearch,
  debounce: debounceMs,
  invalid,
}: InnerComboboxProps) {
  const anchor = useComboboxAnchor();

  const [query, setQuery] = React.useState("");
  const [asyncOptions, setAsyncOptions] = React.useState<SelectOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [focusTrigger, setFocusTrigger] = React.useState(0);

  // Gate: never fire a fetch until the user has focused or typed.
  const hasInteractedRef = React.useRef(false);
  // Keep onSearch stable across renders without putting it in effect deps.
  const onSearchRef = React.useRef(onSearch);
  onSearchRef.current = onSearch;

  // ── Async fetch ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (isStatic) return;
    if (!hasInteractedRef.current) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!onSearchRef.current) return;
      setLoading(true);
      try {
        const results = await onSearchRef.current(query);
        if (!cancelled) setAsyncOptions(results ?? []);
      } catch {
        if (!cancelled) setAsyncOptions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // Only re-run when the query or debounce delay actually changes.
    // isStatic is stable (set once); onSearch is accessed via ref.
  }, [query, debounceMs, isStatic, focusTrigger]);

  const options = isStatic ? staticOptions : asyncOptions;

  // ── Label cache ────────────────────────────────────────────────────────────
  // Accumulate labels from every option batch we've ever seen so chips always
  // show correct labels even when the dropdown list changes.
  const labelCacheRef = React.useRef<Record<string, string>>({});

  // Synchronously pre-populate from seed so the very first render already maps
  // pre-selected IDs → labels (a useEffect would cause a one-frame flash).
  if (seedOptions) {
    seedOptions.forEach((o) => {
      labelCacheRef.current[o.value] = o.label;
    });
  }

  // Track the previous seed reference so we only iterate when it actually
  // changes — avoids re-populating the cache on every render.
  const prevSeedRef = React.useRef<SelectOption[] | undefined>(undefined);
  if (seedOptions && seedOptions !== prevSeedRef.current) {
    prevSeedRef.current = seedOptions;
    seedOptions.forEach((o) => {
      labelCacheRef.current[o.value] = o.label;
    });
  }

  // Accumulate from live search / static results.
  const prevOptionsRef = React.useRef<SelectOption[]>([]);
  if (options !== prevOptionsRef.current) {
    prevOptionsRef.current = options;
    options.forEach((o) => {
      labelCacheRef.current[o.value] = o.label;
    });
  }

  const selectedOptions: SelectOption[] = Array.from(
    new Set(selectedValues)
  ).map((v) => ({
    value: v,
    label: labelCacheRef.current[v] ?? v,
  }));

  return (
    <Combobox
      multiple
      items={options}
      itemToStringValue={(opt: SelectOption) => opt.label}
      value={selectedOptions}
      onValueChange={(opts: SelectOption[]) =>
        onChange(Array.from(new Set(opts.map((o) => o.value))))
      }
      disabled={disabled}
      {...(!isStatic ? { filter: () => true } : {})}
    >
      <ComboboxChips
        ref={anchor}
        className="w-full"
        aria-invalid={invalid || undefined}
        onBlur={onBlur}
      >
        <ComboboxValue>
          {(opts: SelectOption[]) => (
            <React.Fragment>
              {opts.map((opt) => (
                <ComboboxChip key={opt.value}>{opt.label}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                ref={triggerRef}
                placeholder={opts.length === 0 ? placeholder : undefined}
                {...(!isStatic
                  ? {
                      onFocus: () => {
                        hasInteractedRef.current = true;
                        setFocusTrigger((n) => n + 1);
                      },
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        hasInteractedRef.current = true;
                        setQuery(e.target.value);
                      },
                    }
                  : {})}
              />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : (
          <>
            <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
            <ComboboxList>
              {(opt: SelectOption) => (
                <ComboboxItem key={opt.value} value={opt}>
                  {opt.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function FormSelectMultiple<T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  emptyMessage,
  debounce = 300,
  disabled,
  ...source
}: FormSelectMultipleProps<T>) {
  const { control } = useFormContext<T>();

  // Derive stable primitives from source so InnerCombobox never receives a
  // new object reference just because the parent re-rendered.
  const isStatic = !("onSearch" in source) || !source.onSearch;
  const staticOptions = isStatic
    ? (source as StaticSource).options
    : ([] as SelectOption[]);
  const seedOptions =
    !isStatic && "options" in source && Array.isArray(source.options)
      ? source.options
      : undefined;
  const onSearch = !isStatic
    ? (source as AsyncSource).onSearch
    : undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedValues: string[] = Array.isArray(field.value)
          ? field.value
          : [];

        return (
          <Field
            data-invalid={fieldState.invalid || undefined}
            className="w-full"
          >
            {label && <FieldLabel>{label}</FieldLabel>}

            <InnerCombobox
              selectedValues={selectedValues}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled ?? field.disabled}
              triggerRef={field.ref}
              placeholder={placeholder}
              emptyMessage={emptyMessage}
              isStatic={isStatic}
              staticOptions={staticOptions}
              seedOptions={seedOptions}
              onSearch={onSearch}
              debounce={debounce}
              invalid={fieldState.invalid}
            />

            {description && (
              <FieldDescription>{description}</FieldDescription>
            )}

            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        );
      }}
    />
  );
}