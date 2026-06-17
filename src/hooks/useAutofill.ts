import { fetchMockFormValues } from "@/dev/forms/mock-registry";
import { useFormStore } from "@/stores/formStore";

export function useAutofill() {
  if (import.meta.env.PROD) {
    return { autofill: () => {} };
  }

  const autofill = () => {
    const { methods, formId } = useFormStore.get();
    if (!methods || !formId) return;
    const values = fetchMockFormValues(formId);
    if (!values) return;
    Object.entries(values).forEach(([key, value]) => {
      methods.setValue(key as any, value as any, {
        shouldDirty: true,
        shouldValidate: true,
      });
    });
  };

  return { autofill };
}
