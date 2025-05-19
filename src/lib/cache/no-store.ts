/**
 * Optimized no-store function with minimal bundle size
 */
export async function unstable_noStore() {
  try {
    // Dynamic import instead of require to minimize bundle size
    const noStoreModule = await import('next/dist/server/web/spec-extension/unstable-no-store');
    return noStoreModule.unstable_noStore();
  } catch (error) {
    console.error('Error with unstable_noStore:', error);
    // No-op fallback
    return;
  }
} 