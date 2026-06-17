import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "./extractApiError";

export function handleApiError(error: unknown) {
  const desc = extractApiError(error);
  useAlertStore.getState().showAlert("An error occurred!", desc, "error");
}