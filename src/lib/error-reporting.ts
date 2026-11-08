/**
 * Central client-side error hook.
 *
 * Errors caught by React error boundaries are reported here. Replace the
 * `console.error` call with your monitoring provider (Sentry, Bugsnag, etc.)
 * when one is added to the project.
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  console.error("[pervez-furniture]", error, {
    route: window.location.pathname,
    ...context,
  });
}
