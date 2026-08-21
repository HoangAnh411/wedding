export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-rose-600 ${className || ""}`}
      />
    </div>
  );
}

export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3 p-4">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 rounded bg-gray-200" style={{ width: `${80 - i * 15}%` }} />
      ))}
    </div>
  );
}