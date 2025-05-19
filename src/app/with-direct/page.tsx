/**
 * Test page with direct internal API import
 */

import { revalidatePath } from 'next/dist/server/web/spec-extension/revalidate';
import TestPage from '@/components/TestPage';
import { runRevalidationTest } from '@/lib/test-actions';

// Create a server action with the specific test parameters
async function testDirectRevalidation() {
  'use server';
  return runRevalidationTest(revalidatePath, {
    type: 'direct',
    method: 'Direct API',
    import: 'next/dist/server/web/spec-extension/revalidate'
    // bundleSize will be determined automatically
  });
}

export default function TestDirectPage() {
  return (
    <TestPage
      title="Direct Internal API Import Test"
      importPath="next/dist/server/web/spec-extension/revalidate"
      method="Direct API"
      bgColor="bg-purple-50"
      buttonColor="bg-purple-500"
      hoverColor="bg-purple-600"
      activeColor="bg-purple-700"
      description="This test uses Next.js internal API directly, bypassing the public API layer:"
      testAction={testDirectRevalidation}
      bundleSize="5.2KB" // تستخدم للعرض فقط، سيتم قياسها فعلياً خلال الاختبار
    >
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Internal Next.js API - not officially supported</li>
        <li>Medium bundle size (~5.2KB)</li>
        <li>May break in future Next.js updates</li>
      </ul>
      
      <div className="mt-6 bg-purple-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Warning: Unstable API</h3>
        <p className="text-sm">
          This approach imports directly from Next.js internal APIs. While it reduces 
          bundle size compared to the standard approach, it&apos;s not officially supported 
          and may break with future Next.js updates.
        </p>
      </div>
    </TestPage>
  );
} 