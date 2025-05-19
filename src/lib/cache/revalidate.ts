/**
 * Optimized cache revalidation functions with minimal bundle size
 */

/**
 * Revalidates a path with minimal bundle size
 */
export async function revalidatePath(path: string, type?: 'page' | 'layout') {
  try {
    // Direct import from internal API to minimize bundle size
    const { revalidatePath: internalRevalidate } = await import('next/dist/server/web/spec-extension/revalidate');
    return internalRevalidate(path, type);
  } catch (error) {
    console.error('Error revalidating path:', error);
    throw error;
  }
}

/**
 * Revalidates a tag with minimal bundle size
 */
export async function revalidateTag(tag: string) {
  try {
    // Direct import from internal API to minimize bundle size
    const { revalidateTag: internalRevalidateTag } = await import('next/dist/server/web/spec-extension/revalidate');
    return internalRevalidateTag(tag);
  } catch (error) {
    console.error('Error revalidating tag:', error);
    throw error;
  }
} 