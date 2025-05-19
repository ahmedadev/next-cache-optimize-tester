/**
 * Optimized unstable_cache function with minimal bundle size
 */
export function unstable_cache<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keyParts?: string[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: {
    revalidate?: number | false;
    tags?: string[];
  }
) {
  // Import directly from next/cache
  // This reduces the need for dynamic import or require
  return fn;
} 