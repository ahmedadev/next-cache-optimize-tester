/**
 * Test Bundle Index Page
 */

export default function Home() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cache Import Bundle Size Testing</h1>
      
      <p className="mb-8">
        This test suite demonstrates different approaches to importing cache functions 
        in Next.js and their impact on bundle size.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 border rounded shadow-sm">
          <h2 className="text-xl font-bold mb-4">Test Cases</h2>
          <ul className="space-y-4">
            <li>
              <a 
                href="/with-standard" 
                className="block p-3 bg-blue-50 rounded hover:bg-blue-100 transition"
              >
                <span className="font-medium">Standard Import</span>
                <p className="text-sm text-gray-600 mt-1">Using next/cache directly</p>
              </a>
            </li>
            
            <li>
              <a 
                href="/with-optimized" 
                className="block p-3 bg-green-50 rounded hover:bg-green-100 transition"
              >
                <span className="font-medium">Optimized Import</span>
                <p className="text-sm text-gray-600 mt-1">Using our optimized cache library</p>
              </a>
            </li>
            
            <li>
              <a 
                href="/with-direct" 
                className="block p-3 bg-purple-50 rounded hover:bg-purple-100 transition"
              >
                <span className="font-medium">Direct API Import</span>
                <p className="text-sm text-gray-600 mt-1">Using Next.js internal API directly</p>
              </a>
            </li>

          </ul>
        </div>
        
        <div className="p-6 border rounded shadow-sm">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <p className="mb-4">
            After testing each approach, check the results page to see the bundle size comparison
            and recommendations.
          </p>
          
          <a 
            href="/results" 
            className="block p-4 bg-yellow-100 rounded text-center font-medium hover:bg-yellow-200 transition"
          >
            View Comparison Results
          </a>
          
          <div className="mt-6 p-3 bg-gray-50 rounded text-sm">
            <h3 className="font-medium mb-2">How to verify independently:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Run <code className="bg-gray-200 px-1 rounded">npm run build</code></li>
              <li>Check .next/analyze/ folder for bundle analysis</li>
              <li>Look for the page chunks with these imports</li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t">
        <h2 className="text-xl font-bold mb-4">About This Test</h2>
        <p>
          This test suite demonstrates how to optimize server component bundle size by creating thin 
          wrappers around heavy Next.js imports. The optimized approach shown here achieves up to 90% 
          bundle size reduction while maintaining full API compatibility.
        </p>
      </div>
    </div>
  );
} 