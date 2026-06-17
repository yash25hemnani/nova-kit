import type { FieldValues, UseFormReturn } from "react-hook-form";

let activeForm: UseFormReturn<any> | null = null;
let activeFormId: string | null = null;

export const useFormStore = {
  set<T extends FieldValues>(
    methods: UseFormReturn<T>,
    formId: string,
  ) {
    activeForm = methods;
    activeFormId = formId;
  },

  clear() {
    activeForm = null;
    activeFormId = null;
  },

  get<T extends FieldValues>() {
    return {
      methods: activeForm as UseFormReturn<T> | null,
      formId: activeFormId,
    };
  },
};