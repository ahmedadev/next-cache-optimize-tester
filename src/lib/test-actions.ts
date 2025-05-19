'use server';

/**
 * Shared test actions for cache revalidation tests
 */

import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

// تعديل نوع RevalidateFunction للسماح بالدوال التي ترجع void أو Promise<void>
type RevalidateFunction = (path: string, type?: 'page' | 'layout') => void | Promise<void>;

interface TestData {
  type: string;
  method: string;
  import: string;
  bundleSize?: string; // أصبحت اختيارية، سنحاول قياسها إن لم تكن موجودة
}

// وظيفة مساعدة لقياس تقريبي لحجم الكود المستورد
// ملاحظة: هذا تقدير تقريبي فقط بناءً على البيانات المعروفة
function estimateBundleSize(importPath: string): string {
  // المسارات المعروفة وأحجامها
  const knownSizes: Record<string, string> = {
    'next/cache': '13.5KB',
    '@/lib/cache/revalidate': '1.5KB',
    'next/dist/server/web/spec-extension/revalidate': '5.2KB',
  };

  if (importPath in knownSizes) {
    return knownSizes[importPath];
  }

  // بالنسبة للمسارات غير المعروفة، تحقق من النمط
  if (importPath.includes('lib/cache')) {
    return '1.5KB'; // افتراض نفس حجم التحسين المخصص
  }
  
  if (importPath.includes('dist/server')) {
    return '5.2KB'; // افتراض نفس حجم API الداخلي
  }

  // القيمة الافتراضية
  return 'Unknown';
}

// وظيفة لقراءة نتائج الاختبارات السابقة للحصول على معلومات حجم الحزمة
function getPreviousTestResults(type: string): { bundleSize?: string } {
  try {
    const resultsPath = path.join(process.cwd(), 'test-results.json');
    if (!fs.existsSync(resultsPath)) {
      return {};
    }
    
    const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    return data[type] || {};
  } catch (error) {
    console.error('Error reading previous test results:', error);
    return {};
  }
}

export async function runRevalidationTest(
  revalidateFunc: RevalidateFunction,
  testData: TestData
) {
  
  const startTime = performance.now();
  
  try {
    // Perform revalidation using the provided function
    await Promise.resolve(revalidateFunc('/test'));
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // محاولة الحصول على حجم الحزمة بالترتيب:
    // 1. من البيانات المقدمة مباشرة
    // 2. من نتائج الاختبارات السابقة
    // 3. تقدير بناءً على مسار الاستيراد
    let bundleSize = testData.bundleSize;
    
    if (!bundleSize) {
      const previousResults = getPreviousTestResults(testData.type);
      bundleSize = previousResults.bundleSize;
    }
    
    if (!bundleSize) {
      bundleSize = estimateBundleSize(testData.import);
    }
    
    // Store result via API call
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/test-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: testData.type,
        data: {
          time: executionTime.toFixed(2),
          method: testData.method,
          import: testData.import,
          bundleSize
        }
      }),
    });
    
    console.log(`${testData.method} revalidation completed in ${executionTime.toFixed(2)}ms`);
    
    // Redirect to results page
    redirect('/results');
  } catch (error) {
    console.error('Revalidation error:', error);
    throw error;
  }
} 