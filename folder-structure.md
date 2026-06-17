# Module Folder Structure

Generated via `generate-folder.sh --page <page-name> [--singular <singular-name>]`.

```
src/pages/<page-name>/
├── All<PageName>.tsx
├── columns/
│   └── get<PageName>TableColumns.tsx
├── components/
├── dialogs/
│   └── CreateEdit<Singular>Dialog.tsx
├── forms/
│   └── CreateEdit<Singular>Form.tsx
├── queries/
│   ├── <page-name>.queries.ts
│   └── <page-name>.mutations.ts
├── schemas/
│   └── createEdit<Singular>Schema.ts
├── tables/
│   └── <PageName>Table.tsx
└── types/
    └── <singular>.types.ts
```

---

## File Responsibilities

### `All<PageName>.tsx`
The **page root component**. Owns top-level UI state: dialog open/close, selected record for editing, and search query. Composes `PageContainer`, `SearchBar`, the table, and the create/edit dialog together. This is the file registered as the route entry point.

---

### `columns/get<PageName>TableColumns.tsx`
**Column definitions** for the data table. Exports a `get<PageName>TableColumns(handlers?)` function returning a `ColumnDef<T>[]` array. Accepts optional `onView` and `onEdit` callbacks via a `handlers` object so the page can wire up dialog opening. Contains all cell renderers (boolean icons, badges, formatted values, action buttons).

---

### `components/`
**Module-scoped shared components** that don't belong in any single file above. Examples: a detail view panel, a status badge specific to this module, a custom cell renderer reused across multiple column files. Empty by default — populate as the module grows.

---

### `dialogs/CreateEdit<Singular>Dialog.tsx`
**Modal wrapper** for the create/edit form. Uses `AppDialog` with a heading that switches between `"Create <Singular>"` and `"Edit <Singular>"` based on whether a record was passed in. Renders the form via a stable `FORM_ID` so the submit button in the dialog footer can trigger it with `form={FORM_ID}`. Passes `onSuccess={() => onClose()}` to the form.

---

### `forms/CreateEdit<Singular>Form.tsx`
**The create/edit form**. Uses `react-hook-form` + `zodResolver` with `FormProvider` as the wrapper. `defaultValues` are hydrated from the passed record when in edit mode, or set to empty/false defaults for create mode. Calls the appropriate mutation on submit, invalidates the query cache on success, and calls `onSuccess?.()` to close the dialog. Uses form components: `FormInput`, `FormSelect`, `FormCheckbox`, `FormAutocomplete`, `FormSelectMultiple`, `FormTextarea`, `FormFileInput`.

---

### `queries/<page-name>.queries.ts`
**Read-side data layer**. Contains:
- **Fetcher functions** (`get<PageName>`, `get<Singular>`, `search<PageName>`) that call `apiClient`
- **Query key factory** (`<pageName>Key`) with `.all`, `.list(params)`, and `.detail(id)` entries
- **React Query hooks** (`use<PageName>`, `use<Singular>`) wrapping `useQuery`

The `search<PageName>` fetcher returns `{ label, value }` pairs and is passed directly to `FormAutocomplete.onSearch` in other modules that need to reference this resource.

---

### `queries/<page-name>.mutations.ts`
**Write-side data layer**. Contains `create<Singular>` and `edit<Singular>` functions that call `apiClient.post` and `apiClient.patch` respectively. Kept separate from queries so mutation logic stays isolated and tree-shakeable.

---

### `schemas/createEdit<Singular>Schema.ts`
**Zod validation schema** for the create/edit form. Exports:
- `createEdit<Singular>Schema` — the Zod object schema with field-level error messages
- `CreateEdit<Singular>FormValues` — the inferred TypeScript type (`z.infer<typeof ...>`)

This is the single source of truth for form shape and validation rules.

---

### `tables/<PageName>Table.tsx`
**Table component**. Uses `usePaginatedTable` for `queryParams`, `buildPaginationMeta`, `onLimitChange`, and `onPageChange`. Calls the `use<PageName>` hook with merged query params and `searchQuery`. Renders `DataTable` and surfaces API errors via `useAlertStore`. Accepts `onEdit` as a prop and passes it into the column handler.

---

### `types/<singular>.types.ts`
**TypeScript type definitions** for the module. Exports the primary `<Singular>` type matching the API response shape. This is the canonical type used across columns, dialogs, forms, tables, and the page root — never inlined elsewhere.

---

## Naming Conventions

| Token | Derivation | Example input | Example output |
|---|---|---|---|
| `<page-name>` | `--page` flag, kebab-case | `purchase-orders` | `purchase-orders` |
| `<PageName>` | camelCase, capitalised | `purchase-orders` | `PurchaseOrders` |
| `<singular>` | `--singular` flag (defaults to `--page`) | `purchase-order` | `purchase-order` |
| `<Singular>` | singular camelCase, capitalised | `purchase-order` | `PurchaseOrder` |

When `--singular` is omitted, singular and plural tokens are identical. Always pass `--singular` when the plural form is not just the singular + `s` (e.g. `--page companies --singular company`).

---

## Example

```bash
./create-page.sh --page companies --singular company
```

```
src/pages/companies/
├── AllCompanies.tsx
├── columns/get<Companies>TableColumns.tsx
├── components/
├── dialogs/CreateEditCompanyDialog.tsx
├── forms/CreateEditCompanyForm.tsx
├── queries/companies.queries.ts
├── queries/companies.mutations.ts
├── schemas/createEditCompanySchema.ts
├── tables/CompaniesTable.tsx
└── types/company.types.ts
```