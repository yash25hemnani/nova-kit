import { useCallback, useMemo, useState } from "react";
import type { PaginationMeta } from "@/components/ui/data-table";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UsePaginatedTableOptions {
  initialPage?: number;
  initialLimit?: number;
}

export interface UsePaginatedTableReturn {
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  /** Query params ready to append to your API call */
  queryParams: Record<string, string>;
  /** Convert a Django paginated envelope into the PaginationMeta shape DataTable expects */
  buildPaginationMeta: (response: DjangoPage<unknown>) => PaginationMeta;
}

/** Shape returned by every Django list endpoint */
export interface DjangoPage<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const EMPTY_PAGINATED_RESPONSE = {
  count: 0,
  next: null,
  previous: null,
  results: [],
} as const;

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Manages pagination state for Django-style paginated APIs.
 * Pass `onPageChange` / `onLimitChange` directly to <DataTable />.
 * Use `queryParams` to append to your API fetch / query key.
 *
 * @example
 * const { onPageChange, onLimitChange, queryParams, buildPaginationMeta } = usePaginatedTable();
 *
 * const { data } = useQuery({
 *   queryKey: ["products", queryParams],
 *   queryFn:  () => fetchProducts(queryParams),
 * });
 *
 * <DataTable
 *   pagination={buildPaginationMeta(data)}
 *   onPageChange={onPageChange}
 *   onLimitChange={onLimitChange}
 *   ...
 * />
 */
export function usePaginatedTable({
  initialPage = 1,
  initialLimit = 20,
}: UsePaginatedTableOptions = {}): UsePaginatedTableReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const onLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  // Django uses `page_size`, not `limit`
  const queryParams = useMemo(
    () => ({ page: String(page), page_size: String(limit) }),
    [page, limit],
  );

  // Derive every field DataTable needs from the raw Django envelope
  const buildPaginationMeta = useCallback(
    (response: DjangoPage<unknown>): PaginationMeta => {
      const totalPages = Math.ceil(response.count / limit) || 1;
      return {
        total: response.count,
        page,
        limit,
        totalPages,
        hasNext: response.next !== null,
        hasPrev: response.previous !== null,
      };
    },
    [page, limit],
  );

  return {
    page, // current page number
    limit, // number of rows per page
    onPageChange, // pass to <DataTable onPageChange={} />
    onLimitChange, // pass to <DataTable onLimitChange={} />
    queryParams, // pass to useWarehouses(queryParams), Eg: { page: "2", page_size: "25" }
    buildPaginationMeta, // pass to <DataTable pagination={buildPaginationMeta(data)} />
  };
}
