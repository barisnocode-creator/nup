/**
 * Safe nested property accessor for deeply nested objects.
 * Uses dot-notation path and returns fallback if any step is null/undefined/empty.
 */
export function safeGet<T>(
  obj: unknown,
  path: string,
  fallback: T
): T {
  const value = path.split('.').reduce<unknown>(
    (acc, key) => (acc != null ? (acc as Record<string, unknown>)[key] : undefined),
    obj
  );
  return (value !== undefined && value !== null && value !== '')
    ? (value as T)
    : fallback;
}
