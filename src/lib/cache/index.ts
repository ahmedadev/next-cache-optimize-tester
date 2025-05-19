/**
 * Optimized cache functions to reduce bundle size
 * This is the main entry point that exports all cache functions
 */

// Export individual functions
export * from './no-store';
export * from './unstable-cache';
export * from './revalidate';

// For automatic expiration
export * from './expire';

// Advanced: If you want to import all functions dynamically
// This helps reduce the initial bundle size further
export const dynamicImport = {
  unstable_noStore: () => import('./no-store').then(mod => mod.unstable_noStore),
  unstable_cache: () => import('./unstable-cache').then(mod => mod.unstable_cache),
  revalidatePath: () => import('./revalidate').then(mod => mod.revalidatePath),
  revalidateTag: () => import('./revalidate').then(mod => mod.revalidateTag),
  expireCache: () => import('./expire').then(mod => mod.expireCache),
}; 