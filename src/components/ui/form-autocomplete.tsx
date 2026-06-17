"use client";

import * as React from "react";
import { Controller, useFormContext, type FieldValues, type Path } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

// ─── Types ────────────────────────────────────────────────────────────────────

type AutocompleteOption = {
  label: string;
  value: string;
};

/** Static options — filtered client-side by Combobox */
type StaticSource = {
  options: AutocompleteOption[];
  onSearch?: never;
};

/**
 * Async search — consumer owns the fetch, caching, and error handling.
 * Called with the current query string; must return `AutocompleteOption[]`.
 *
 * @example
 * // Plain apiClient
 * onSearch={async (q) => {
 *   const { data } = await apiClient.get("/users/search", { params: { search: q } });
 *   return data.data;
 * }}
 *
 * @example
 * // With React Query
 * const searchUsers = useCallback(async (q: string) => {
 *   const { data } = await apiClient.get("/users/search", { params: { search: q } });
 *   return data.data;
 * }, []);
 */
type AsyncSource = {
  onSearch: (query: string) => Promise<AutocompleteOption[]>;
  options?: never;
};

type FormAutocompleteProps<T extends FieldValues> = (StaticSource | AsyncSource) & {
  name: Path<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  emptyMessage?: string;
  /** Debounce delay in ms for async calls (default: 300) */
  debounce?: number;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useAutocompleteOptions(
  source: StaticSource | AsyncSource,
  query: string,
  debounce: number
) {
  const [asyncOptions, setAsyncOptions] = React.useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = React.useState(false);

  const isStatic = "options" in source && !!source.options;

  React.useEffect(() => {
    if (isStatic) return;
    if (!("onSearch" in source) || !source.onSearch) return;

    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await source.onSearch(query);
        if (!cancelled) setAsyncOptions(results ?? []);
      } catch {
        if (!cancelled) setAsyncOptions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, debounce);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [source, query, debounce, isStatic]);

  return {
    options: isStatic ? (source as StaticSource).options : asyncOptions,
    loading,
  };
}

// ─── Inner combobox ───────────────────────────────────────────────────────────

type InnerComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
  triggerRef: React.Ref<HTMLInputElement>;
  placeholder?: string;
  emptyMessage?: string;
  source: StaticSource | AsyncSource;
  debounce: number;
  invalid?: boolean;
};

function InnerCombobox({
  value,
  onChange,
  onBlur,
  disabled,
  triggerRef,
  placeholder = "Search…",
  emptyMessage = "No results found.",
  source,
  debounce,
  invalid,
}: InnerComboboxProps) {
  const [query, setQuery] = React.useState("");
  const { options, loading } = useAutocompleteOptions(source, query, debounce);

  const isStatic = "options" in source && !!source.options;

  return (
    <Combobox
      items={options}
      itemToStringValue={(opt) => opt.label}
      value={options.find((o) => o.value === value) ?? null}
      onValueChange={(opt) => onChange(opt?.value ?? "")}
      {...(!isStatic ? { filter: () => true } : {})}
    >
      <ComboboxInput
        ref={triggerRef}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onBlur={onBlur}
        onChange={
          !isStatic
            ? (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)
            : undefined
        }
      />
      <ComboboxContent>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : (
          <>
            <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
            <ComboboxList>
              {(opt) => (
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

export function FormAutocomplete<T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  emptyMessage,
  debounce = 300,
  ...source
}: FormAutocompleteProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined} className="w-full">
          {label && <FieldLabel>{label}</FieldLabel>}

          <InnerCombobox
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={field.disabled}
            triggerRef={field.ref}
            placeholder={placeholder}
            emptyMessage={emptyMessage}
            source={source as StaticSource | AsyncSource}
            debounce={debounce}
            invalid={fieldState.invalid}
          />

          {description && <FieldDescription>{description}</FieldDescription>}

          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}