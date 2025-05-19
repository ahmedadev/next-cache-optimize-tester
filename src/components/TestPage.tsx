'use client';

import Link from "next/link";

/**
 * Shared test page component for all cache import tests
 */
interface TestPageProps {
  title: string;
  importPath: string;
  method: string;
  bgColor: string;
  buttonColor: string;
  hoverColor: string;
  activeColor: string;
  description: string;
  testAction: () => Promise<void>;
  bundleSize?: string;
  children?: React.ReactNode;
}

export default function TestPage({
  title,
  importPath,
  method,
  bgColor,
  buttonColor,
  hoverColor,
  activeColor,
  description,
  testAction,
  bundleSize,
  children
}: TestPageProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        
        <div className="flex space-x-2">
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 active:bg-gray-400 transition-colors duration-150"
          >
            Home
          </Link>
          <Link 
            href="/results"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 active:bg-gray-400 transition-colors duration-150"
          >
            Results
          </Link>
        </div>
      </div>
      
      <div className={`mb-8 p-6 border rounded-lg shadow-md ${bgColor}`}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{`Testing ${method} Import`}</h2>
        
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 md:mr-4">
            <div className="bg-white p-4 rounded-lg mb-6">
              <pre className="bg-gray-50 p-3 rounded overflow-x-auto">
                <code className="text-sm">import &#123; revalidatePath &#125; from &apos;{importPath}&apos;</code>
              </pre>
            </div>
            
            <div className="mb-6">
              <p className="mb-3 text-gray-700">{description}</p>
              {children}
            </div>
          </div>
          
          {bundleSize && (
            <div className="w-full md:w-64 bg-white p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2 text-gray-800">Quick Facts</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium">{method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bundle Size:</span>
                  <span className="font-medium">{bundleSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Import:</span>
                  <span className="font-mono text-xs truncate max-w-32" title={importPath}>
                    {importPath}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form action={testAction}>
          <button 
            type="submit"
            className={`px-6 py-3 ${buttonColor} text-white rounded-lg font-bold
                     hover:${hoverColor} active:${activeColor} active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-${buttonColor.replace('bg-', '')}
                     transition-all duration-150 transform`}
          >
            {`Run ${method} Test`}
          </button>
        </form>
      </div>
    </div>
  );
} 