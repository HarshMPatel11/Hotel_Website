export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (!err) return fallback;
  if (typeof err === "object" && err !== null) {
    const anyErr = err as { data?: { error?: string }; message?: string };
    if (anyErr.data?.error) return anyErr.data.error;
    if (anyErr.message) return anyErr.message;
  }
  return fallback;
}
