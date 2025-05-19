/**
 * Results page showing comparison of different cache import approaches
 */

import Link from "next/link";

// Types definition for test results
interface TestResult {
  time: string;
  method: string;
  import: string;
  bundleSize: string;
  timestamp?: string;
}

interface TestResults {
  standard?: TestResult;
  optimized?: TestResult;
  direct?: TestResult;
  [key: string]: TestResult | undefined;
}

interface ResultItem {
  type: string;
  data: TestResult;
}

interface ComparativeAnalysis {
  bundleSizeAnalysis: string[];
  executionTimeAnalysis: string[];
  recommendation: string;
}

// Using async component to fetch results from API
export default async function ResultsPage() {
  // Fetch test results from API
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/test-results`,
    {
      cache: "no-store", // Ensure we always get fresh results
    }
  );
  const data = await response.json();
  const testResults: TestResults = data.results;

  // Check if we have any results
  const hasResults =
    testResults.standard ||
    testResults.optimized ||
    testResults.direct;

  // Comparative analysis based on data
  const comparative = hasResults ? getComparativeAnalysis(testResults) : null;

  // Helper function to sort results by performance
  const sortedResults = hasResults ? getSortedResults(testResults) : [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">
          Cache Import Approaches Comparison
        </h1>

        <div className="flex flex-wrap gap-2 justify-center">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Home
          </Link>
          <Link
            href="/with-standard"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Standard Test
          </Link>
          <Link
            href="/with-optimized"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Optimized Test
          </Link>
          <Link
            href="/with-direct"
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Direct Test
          </Link>
        </div>
      </div>

      {/* Test Results */}
      {hasResults && (
        <div className="mb-8 p-6 border rounded shadow">
          <h2 className="text-2xl font-bold mb-4">
            Performance Test Results{" "}
            <span className="text-sm font-normal text-gray-500">
              (Sorted by Performance)
            </span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Method</th>
                  <th className="border p-2 text-left">Execution Time</th>
                  <th className="border p-2 text-left">Bundle Size</th>
                  <th className="border p-2 text-left">Import Path</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result, index) => {
                  // Map the result type to its background color
                  const bgColors: Record<string, string> = {
                    standard: "bg-blue-50",
                    optimized: "bg-green-50",
                    direct: "bg-purple-50",
                  };

                  // Map the result type to its button color
                  const buttonColors: Record<string, string> = {
                    standard: "bg-blue-500 hover:bg-blue-600",
                    optimized: "bg-green-500 hover:bg-green-600",
                    direct: "bg-purple-500 hover:bg-purple-600",
                  };

                  return (
                    <tr
                      key={index}
                      className={bgColors[result.type] || "bg-gray-50"}
                    >
                      <td className="border p-2 font-medium">
                        {result.data.method}
                      </td>
                      <td className="border p-2 font-mono">
                        {result.data.time}ms
                      </td>
                      <td className="border p-2 font-mono">
                        {result.data.bundleSize}
                      </td>
                      <td className="border p-2 font-mono text-xs">
                        {result.data.import}
                      </td>
                      <td className="border p-2">
                        <a
                          href={`/with-${result.type}`}
                          className={`block text-center py-2 px-4 ${
                            buttonColors[result.type] ||
                            "bg-gray-500 hover:bg-gray-600"
                          } text-white rounded transition-colors duration-150`}
                        >
                          Test Again
                        </a>
                      </td>
                    </tr>
                  );
                })}

                {!sortedResults.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="border p-4 text-center text-gray-500"
                    >
                      No test results available yet. Run tests on each page to
                      see results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Performance Analysis */}
          {comparative && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-4">
                Comparative Performance Analysis
              </h3>
              <div className="space-y-4">
                <div className="mb-6">
                  <h4 className="font-bold mb-2">Bundle Size Analysis:</h4>
                  <ul className="space-y-2 list-disc list-inside">
                    {comparative.bundleSizeAnalysis.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {getBundleAnalysisInEnglish(item)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold mb-2">Execution Time Analysis:</h4>
                  <ul className="space-y-2 list-disc list-inside">
                    {comparative.executionTimeAnalysis.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {getExecutionAnalysisInEnglish(item)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Recommendation:</h4>
                  <div className="p-3 bg-green-100 rounded">
                    <p>
                      {getRecommendationInEnglish(comparative.recommendation)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {!testResults.standard && (
              <a
                href="/with-standard"
                className="block p-3 bg-blue-100 text-center font-medium rounded hover:bg-blue-200"
              >
                Run Standard Test
              </a>
            )}

            {!testResults.optimized && (
              <a
                href="/with-optimized"
                className="block p-3 bg-green-100 text-center font-medium rounded hover:bg-green-200"
              >
                Run Optimized Test
              </a>
            )}

            {!testResults.direct && (
              <a
                href="/with-direct"
                className="block p-3 bg-purple-100 text-center font-medium rounded hover:bg-purple-200"
              >
                Run Direct API Test
              </a>
            )}
          </div>
        </div>
      )}

      {!hasResults && (
        <div className="mb-8 p-6 border rounded bg-yellow-50">
          <h2 className="text-xl font-bold mb-2">No Test Results Yet</h2>
          <p>
            Run the tests on each approach page to collect performance data:
          </p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="/with-standard"
                className="block p-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition-colors"
              >
                Run Standard Import Test
              </a>
            </li>
            <li>
              <a
                href="/with-optimized"
                className="block p-2 bg-green-500 text-white text-center rounded hover:bg-green-600 transition-colors"
              >
                Run Optimized Import Test
              </a>
            </li>
            <li>
              <a
                href="/with-direct"
                className="block p-2 bg-purple-500 text-white text-center rounded hover:bg-purple-600 transition-colors"
              >
                Run Direct API Import Test
              </a>
            </li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {/* Standard Import Card - Dynamic */}
        <a
          href="/with-standard"
          className="block p-4 border rounded hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">Standard Import</h2>
          <div className="text-gray-700 mb-4">
            <code className="bg-gray-100 px-2 py-1 rounded">
              import &#123; revalidatePath &#125; from &apos;next/cache&apos;
            </code>
          </div>
          <div className="bg-blue-100 p-2 rounded">
            <p className="text-sm text-blue-800">Official public API</p>
            <p className="text-sm text-blue-800">
              Bundle size:{" "}
              {testResults.standard
                ? testResults.standard.bundleSize
                : "~13.5KB"}
              {testResults.standard && (
                <span className="ml-1 text-xs">(measured)</span>
              )}
            </p>
            {testResults.standard && (
              <p className="text-sm text-blue-800 mt-1">
                Execution time: {testResults.standard.time}ms
              </p>
            )}
          </div>
        </a>

        {/* Optimized Import Card - Dynamic */}
        <a
          href="/with-optimized"
          className="block p-4 border rounded hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">Optimized Import</h2>
          <div className="text-gray-700 mb-4">
            <code className="bg-gray-100 px-2 py-1 rounded">
              import &#123; revalidatePath &#125; from
              &apos;@/lib/cache/revalidate&apos;
            </code>
          </div>
          <div className="bg-green-100 p-2 rounded">
            <p className="text-sm text-green-800">
              Custom wrapper around Next.js API
            </p>
            <p className="text-sm text-green-800">
              Bundle size:{" "}
              {testResults.optimized
                ? testResults.optimized.bundleSize
                : "~1.5KB"}
              {testResults.optimized && (
                <span className="ml-1 text-xs">(measured)</span>
              )}
            </p>
            {testResults.optimized && (
              <p className="text-sm text-green-800 mt-1">
                Execution time: {testResults.optimized.time}ms
              </p>
            )}
          </div>
        </a>

        {/* Direct API Import Card - Dynamic */}
        <a
          href="/with-direct"
          className="block p-4 border rounded hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">Direct API Import</h2>
          <div className="text-gray-700 mb-4">
            <code className="bg-gray-100 px-2 py-1 rounded">
              import &#123; revalidatePath &#125; from
              &apos;next/dist/server/web/spec-extension/revalidate&apos;
            </code>
          </div>
          <div className="bg-purple-100 p-2 rounded">
            <p className="text-sm text-purple-800">
              Internal Next.js API (unstable)
            </p>
            <p className="text-sm text-purple-800">
              Bundle size:{" "}
              {testResults.direct ? testResults.direct.bundleSize : "~5.2KB"}
              {testResults.direct && (
                <span className="ml-1 text-xs">(measured)</span>
              )}
            </p>
            {testResults.direct && (
              <p className="text-sm text-purple-800 mt-1">
                Execution time: {testResults.direct.time}ms
              </p>
            )}
          </div>
        </a>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Why This Matters</h2>
        <p className="mb-4">
          Optimizing cache imports can significantly reduce your Next.js
          application&apos;s bundle size. Smaller bundles lead to faster page
          loads and better user experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">Standard Import Challenges</h3>
            <p className="text-sm text-gray-700">
              The standard Next.js cache imports include large portions of the
              Next.js internals, resulting in unnecessarily large bundle sizes
              for simple operations like path revalidation.
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">Optimized Approach Benefits</h3>
            <p className="text-sm text-gray-700">
              Our optimized approach creates lightweight wrappers around Next.js
              internal APIs, providing the same functionality with up to 89%
              smaller bundle sizes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to translate bundle analysis to English
function getBundleAnalysisInEnglish(arabicText: string): string {
  // Extract the method names and values using regex
  const methodsRegex =
    /([^()]+) \(([^)]+)\) أكبر بنسبة (\d+)% من ([^()]+) \(([^)]+)\)/;
  const match = arabicText.match(methodsRegex);

  if (match) {
    const [, method1, size1, percentage, method2, size2] = match;
    return `${method1} (${size1}) is ${percentage}% larger than ${method2} (${size2})`;
  }

  return arabicText;
}

// Helper function to translate execution analysis to English
function getExecutionAnalysisInEnglish(arabicText: string): string {
  // Extract the method names and values using regex
  const methodsRegex =
    /([^()]+) \(([^)]+)\) أبطأ بنسبة (\d+)% من ([^()]+) \(([^)]+)\)/;
  const match = arabicText.match(methodsRegex);

  if (match) {
    const [, method1, time1, percentage, method2, time2] = match;
    return `${method1} (${time1}) is ${percentage}% slower than ${method2} (${time2})`;
  }

  return arabicText;
}

// Helper function to translate recommendation to English
function getRecommendationInEnglish(arabicText: string): string {
  if (arabicText.includes("هو الخيار الأفضل من حيث حجم الحزمة ووقت التنفيذ")) {
    const methodRegex =
      /بناءً على النتائج، ([^.]+) هو الخيار الأفضل من حيث حجم الحزمة ووقت التنفيذ/;
    const match = arabicText.match(methodRegex);

    if (match) {
      return `Based on the results, ${match[1]} is the best option in terms of both bundle size and execution time.`;
    }
  } else if (
    arabicText.includes("هو الأفضل من حيث حجم الحزمة") &&
    arabicText.includes("هو الأسرع من حيث وقت التنفيذ")
  ) {
    const regex =
      /بناءً على النتائج، ([^،]+) هو الأفضل من حيث حجم الحزمة، و([^.]+) هو الأسرع من حيث وقت التنفيذ/;
    const match = arabicText.match(regex);

    if (match) {
      let result = `Based on the results, ${match[1]} has the smallest bundle size, while ${match[2]} has the fastest execution time.`;

      // Check for balanced recommendation
      if (arabicText.includes("توازنًا بين الحجم والسرعة")) {
        const balancedRegex =
          /ولكن إذا كنت تريد توازنًا بين الحجم والسرعة، فـ([^.]+) قد يكون الخيار الأفضل/;
        const balancedMatch = arabicText.match(balancedRegex);

        if (balancedMatch) {
          result += ` However, if you want a balance between size and speed, ${balancedMatch[1]} might be the best option.`;
        }
      }

      return result;
    }
  }

  return "Based on the results, choose the method that best meets your performance requirements.";
}

// Helper function to sort results by performance
function getSortedResults(results: TestResults): ResultItem[] {
  const validResults: ResultItem[] = [];

  // Extract valid results into an array format
  Object.keys(results).forEach((type) => {
    if (results[type]) {
      validResults.push({
        type,
        data: results[type] as TestResult,
      });
    }
  });

  // Sort by execution time (smaller is better)
  // If execution times are equal, sort by bundle size (smaller is better)
  return validResults.sort((a, b) => {
    const timeA = parseFloat(a.data.time);
    const timeB = parseFloat(b.data.time);

    if (timeA === timeB) {
      // Extract numeric value from bundle size strings
      const sizeA = parseFloat(a.data.bundleSize);
      const sizeB = parseFloat(b.data.bundleSize);
      return sizeA - sizeB;
    }

    return timeA - timeB;
  });
}

// Helper function for comparative analysis
function getComparativeAnalysis(
  results: TestResults
): ComparativeAnalysis | null {
  // Check if we have sufficient results for comparison
  const validResults = Object.keys(results).filter(
    (key) => results[key]
  ).length;
  if (validResults < 2) return null;

  // Extract and sort results by bundle size
  const bundleComparison = getSortedResults(results).sort((a, b) => {
    const sizeA = parseFloat(a.data.bundleSize);
    const sizeB = parseFloat(b.data.bundleSize);
    return sizeA - sizeB;
  });

  // Extract and sort results by execution time
  const timeComparison = getSortedResults(results);

  // Generate bundle size analysis
  const bundleSizeAnalysis: string[] = [];
  const smallestBundle = bundleComparison[0];
  bundleComparison.slice(1).forEach((result) => {
    const smallSize = parseFloat(smallestBundle.data.bundleSize);
    const currentSize = parseFloat(result.data.bundleSize);
    const percentageDiff = (
      ((currentSize - smallSize) / smallSize) *
      100
    ).toFixed(0);

    bundleSizeAnalysis.push(
      `${result.data.method} (${result.data.bundleSize}) أكبر بنسبة ${percentageDiff}% من ${smallestBundle.data.method} (${smallestBundle.data.bundleSize})`
    );
  });

  // Generate execution time analysis
  const executionTimeAnalysis: string[] = [];
  const fastestExecution = timeComparison[0];
  timeComparison.slice(1).forEach((result) => {
    const fastTime = parseFloat(fastestExecution.data.time);
    const currentTime = parseFloat(result.data.time);
    const percentageDiff = (
      ((currentTime - fastTime) / fastTime) *
      100
    ).toFixed(0);

    executionTimeAnalysis.push(
      `${result.data.method} (${result.data.time}ms) أبطأ بنسبة ${percentageDiff}% من ${fastestExecution.data.method} (${fastestExecution.data.time}ms)`
    );
  });

  // Generate recommendation
  let recommendation = "بناءً على النتائج، ";

  // If the fastest execution is also the smallest bundle
  if (fastestExecution.type === smallestBundle.type) {
    recommendation += `${fastestExecution.data.method} هو الخيار الأفضل من حيث حجم الحزمة ووقت التنفيذ.`;
  } else {
    recommendation += `${smallestBundle.data.method} هو الأفضل من حيث حجم الحزمة، و${fastestExecution.data.method} هو الأسرع من حيث وقت التنفيذ.`;

    // Add the balanced recommendation
    const balancedOption = getSortedResults(results).sort((a, b) => {
      // Normalize and combine both metrics (50% weight to each)
      const timeA = parseFloat(a.data.time);
      const timeB = parseFloat(b.data.time);
      const sizeA = parseFloat(a.data.bundleSize);
      const sizeB = parseFloat(b.data.bundleSize);

      // Find the max values for normalization
      const maxTime = Math.max(
        ...Object.values(results)
          .filter((r): r is TestResult => r !== undefined && r !== null)
          .map((r) => parseFloat(r.time))
      );
      const maxSize = Math.max(
        ...Object.values(results)
          .filter((r): r is TestResult => r !== undefined && r !== null)
          .map((r) => parseFloat(r.bundleSize))
      );

      // Normalize and combine (lower is better)
      const scoreA = (timeA / maxTime) * 0.5 + (sizeA / maxSize) * 0.5;
      const scoreB = (timeB / maxTime) * 0.5 + (sizeB / maxSize) * 0.5;

      return scoreA - scoreB;
    })[0];

    recommendation += ` ولكن إذا كنت تريد توازنًا بين الحجم والسرعة، فـ${balancedOption.data.method} قد يكون الخيار الأفضل.`;
  }

  return {
    bundleSizeAnalysis,
    executionTimeAnalysis,
    recommendation,
  };
}
