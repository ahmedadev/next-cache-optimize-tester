import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to store results
const resultsPath = path.join(process.cwd(), 'test-results.json');

// Initialize results file if it doesn't exist
if (!fs.existsSync(resultsPath)) {
  fs.writeFileSync(resultsPath, JSON.stringify({
    standard: null,
    optimized: null,
    direct: null  }));
}

// Test result data type
interface TestResultData {
  time: string;
  method: string;
  import: string;
  bundleSize?: string;
  timestamp?: string;
  [key: string]: string | undefined;
}

// Function to read current results
function getTestResults() {
  try {
    const data = fs.readFileSync(resultsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading test results:', error);
    return {
      standard: null,
      optimized: null,
      direct: null
    };
  }
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

  // القيمة الافتراضية
  return 'Unknown';
}

// Function to store test result - only used internally
function storeTestResult(type: string, data: TestResultData) {
  try {
    const currentResults = getTestResults();
    const existingData = currentResults[type] || {};
    
    // إذا لم يتم توفير حجم الحزمة، حاول استخدام القيمة السابقة أو التقدير
    if (!data.bundleSize) {
      data.bundleSize = existingData.bundleSize || estimateBundleSize(data.import);
    }
    
    currentResults[type] = {
      ...existingData,     // الحفاظ على البيانات السابقة
      ...data,             // تحديث البيانات الجديدة
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(resultsPath, JSON.stringify(currentResults, null, 2));
  } catch (err) {
    console.error('Error saving test results:', err);
  }
}

export async function GET() {
  const results = getTestResults();
  return NextResponse.json({ results });
}

// Add POST handler to store results
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      );
    }
    
    storeTestResult(type, data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to store test results:', err);
    return NextResponse.json(
      { error: 'Failed to store test results' },
      { status: 500 }
    );
  }
} 