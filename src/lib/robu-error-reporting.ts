type RobuErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type RobuEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: RobuErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __robuEvents?: RobuEvents;
  }
}

export function reportRobuError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__robuEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
