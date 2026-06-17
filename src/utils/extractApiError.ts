export const extractApiError = (error: any): string => {
  const data = error?.response?.data;

  // Axios network error (no response)
  if (!error?.response) {
    return "Network error. Please check your connection.";
  }

  // Django DRF standard error
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  // Validation errors (field errors)
  if (data && typeof data === "object") {
    const firstKey = Object.keys(data)[0];

    if (firstKey) {
      const value = data[firstKey];

      if (Array.isArray(value)) return value[0];
      if (typeof value === "string") return value;
    }
  }

  // fallback
  return "Something went wrong (server error)";
};