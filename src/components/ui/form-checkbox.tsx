"use client";

import {
    Controller,
    useFormContext,
    type FieldValues,
    type Path,
} from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

type FormCheckboxProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
};

export function FormCheckbox<T extends FieldValues>({
  name,
  label,
  description,
}: FormCheckboxProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <div className="flex items-center gap-2">
            <Checkbox
              ref={field.ref}
              checked={field.value}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
              disabled={field.disabled}
              aria-invalid={fieldState.invalid || undefined}
            />
            {label && <FieldLabel>{label}</FieldLabel>}
          </div>

          {description && <FieldDescription>{description}</FieldDescription>}

          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}