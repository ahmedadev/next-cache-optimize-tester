/**
 * Test page with optimized cache import
 */

import { revalidatePath } from '@/lib/cache/revalidate';
import TestPage from '@/components/TestPage';
import { runRevalidationTest } from '@/lib/test-actions';

// Create a server action with the specific test parameters
async function testOptimizedRevalidation() {
  'use server';
  return runRevalidationTest(revalidatePath, {
    type: 'optimized',
    method: 'Optimized',
    import: '@/lib/cache/revalidate'
    // bundleSize will be determined automatically
  });
}

export default function TestOptimizedPage() {
  return (
    <TestPage
      title="Optimized Cache Import Test"
      importPath="@/lib/cache/revalidate"
      method="Optimized"
      bgColor="bg-green-50"
      buttonColor="bg-green-500"
      hoverColor="bg-green-600"
      activeColor="bg-green-700"
      description="This test uses our optimized cache implementation that reduces bundle size significantly:"
      testAction={testOptimizedRevalidation}
    >
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Custom implementation that wraps Next.js internal APIs</li>
        <li>Dynamically imports only what&apos;s needed when called</li>
        <li>Reduced bundle size (only ~1.5KB)</li>
      </ul>
      
      <div className="mt-6 bg-green-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">How it works</h3>
        <p className="text-sm">
          Our optimized implementation uses dynamic imports to load Next.js internal APIs only 
          when needed, resulting in much smaller initial bundle sizes without losing functionality.
        </p>
      </div>
    </TestPage>
  );
} 