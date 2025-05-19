/**
 * Test page with standard Next.js cache import
 */

import { revalidatePath } from 'next/cache';
import TestPage from '@/components/TestPage';
import { runRevalidationTest } from '@/lib/test-actions';

// Create a server action with the specific test parameters
async function testStandardRevalidation() {
  'use server';
  return runRevalidationTest(revalidatePath, {
    type: 'standard',
    method: 'Standard',
    import: 'next/cache'
    // bundleSize will be determined automatically
  });
}

export default function TestStandardPage() {
  return (
    <TestPage
      title="Standard Cache Import Test"
      importPath="next/cache"
      method="Standard"
      bgColor="bg-blue-50"
      buttonColor="bg-blue-500"
      hoverColor="bg-blue-600"
      activeColor="bg-blue-700"
      description="This test uses the standard Next.js cache import directly. This is the default approach but results in larger bundle sizes:"
      testAction={testStandardRevalidation}
      bundleSize="13.5KB" // تستخدم للعرض فقط، سيتم قياسها فعلياً خلال الاختبار
    >
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Official Next.js API</li>
        <li>Imports the entire Next.js cache infrastructure</li>
        <li>Larger bundle size (~13.5KB)</li>
      </ul>
      
      <div className="mt-6 bg-blue-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">How it works</h3>
        <p className="text-sm">
          The standard import brings in the full Next.js cache implementation.
          While convenient, this increases your application&apos;s bundle size significantly.
        </p>
      </div>
    </TestPage>
  );
} 