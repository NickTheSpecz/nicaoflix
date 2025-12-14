/**
 * Example usage of ErrorBoundary component
 */

import React, { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from './Button';

// Component that throws an error
function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('This is a test error from BuggyComponent!');
  }
  return <div className="text-text-primary">Component is working fine!</div>;
}

// Example 1: Basic ErrorBoundary usage
export function BasicErrorBoundaryExample() {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-text-primary">
        Basic ErrorBoundary Example
      </h2>
      
      <Button onClick={() => setShouldThrow(!shouldThrow)}>
        {shouldThrow ? 'Fix Component' : 'Break Component'}
      </Button>

      <ErrorBoundary>
        <BuggyComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
}

// Example 2: ErrorBoundary with custom fallback
export function CustomFallbackExample() {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-text-primary">
        Custom Fallback Example
      </h2>
      
      <Button onClick={() => setShouldThrow(!shouldThrow)}>
        {shouldThrow ? 'Fix Component' : 'Break Component'}
      </Button>

      <ErrorBoundary
        fallback={(error, reset) => (
          <div className="p-6 bg-error/10 border border-error rounded-lg">
            <h3 className="text-xl font-semibold text-error mb-2">
              Custom Error UI
            </h3>
            <p className="text-text-secondary mb-4">
              Something went wrong: {error.message}
            </p>
            <Button onClick={reset} variant="primary">
              Try Again
            </Button>
          </div>
        )}
      >
        <BuggyComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
}

// Example 3: ErrorBoundary with error logging
export function ErrorLoggingExample() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [errorLog, setErrorLog] = useState<string[]>([]);

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-text-primary">
        Error Logging Example
      </h2>
      
      <Button onClick={() => setShouldThrow(!shouldThrow)}>
        {shouldThrow ? 'Fix Component' : 'Break Component'}
      </Button>

      <ErrorBoundary
        onError={(error, errorInfo) => {
          const logEntry = `[${new Date().toISOString()}] ${error.message}`;
          setErrorLog((prev) => [...prev, logEntry]);
        }}
      >
        <BuggyComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>

      {errorLog.length > 0 && (
        <div className="mt-4 p-4 bg-surface rounded-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Error Log:
          </h3>
          <ul className="space-y-1">
            {errorLog.map((log, index) => (
              <li key={index} className="text-sm text-text-secondary font-mono">
                {log}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Example 4: Nested ErrorBoundaries
export function NestedErrorBoundariesExample() {
  const [throwInOuter, setThrowInOuter] = useState(false);
  const [throwInInner, setThrowInInner] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-text-primary">
        Nested ErrorBoundaries Example
      </h2>
      
      <div className="flex gap-4">
        <Button onClick={() => setThrowInOuter(!throwInOuter)}>
          {throwInOuter ? 'Fix Outer' : 'Break Outer'}
        </Button>
        <Button onClick={() => setThrowInInner(!throwInInner)}>
          {throwInInner ? 'Fix Inner' : 'Break Inner'}
        </Button>
      </div>

      <ErrorBoundary>
        <div className="p-4 bg-surface rounded-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Outer Component
          </h3>
          <BuggyComponent shouldThrow={throwInOuter} />

          <ErrorBoundary>
            <div className="mt-4 p-4 bg-surface-light rounded-lg">
              <h4 className="text-md font-semibold text-text-primary mb-2">
                Inner Component
              </h4>
              <BuggyComponent shouldThrow={throwInInner} />
            </div>
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    </div>
  );
}

// Example 5: ErrorBoundary with async errors
function AsyncBuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  const [error, setError] = useState<Error | null>(null);

  React.useEffect(() => {
    if (shouldThrow) {
      // Simulate async error
      setTimeout(() => {
        setError(new Error('Async error occurred!'));
      }, 100);
    } else {
      setError(null);
    }
  }, [shouldThrow]);

  if (error) {
    throw error;
  }

  return <div className="text-text-primary">Async component is working!</div>;
}

export function AsyncErrorExample() {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-text-primary">
        Async Error Example
      </h2>
      
      <Button onClick={() => setShouldThrow(!shouldThrow)}>
        {shouldThrow ? 'Fix Component' : 'Trigger Async Error'}
      </Button>

      <ErrorBoundary>
        <AsyncBuggyComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
}
