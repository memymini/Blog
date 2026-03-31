export default function PostLoading() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar skeleton */}
      <header className="sticky top-0 z-40 bg-surface border-b border-muted-200">
        <div
          className="mx-auto px-4 h-14 flex items-center justify-between"
          style={{ maxWidth: "var(--max-w-content)" }}
        >
          <div className="h-4 w-16 bg-muted-200 rounded animate-pulse" />
          <div className="h-9 w-9 bg-muted-200 rounded-sm animate-pulse" />
        </div>
      </header>

      <div
        className="mx-auto px-4 py-12"
        style={{ maxWidth: "var(--max-w-content)" }}
      >
        {/* Metadata skeleton */}
        <div className="mb-6">
          <div className="h-3 w-32 bg-muted-200 rounded animate-pulse mb-3" />
          <div className="h-9 w-4/5 bg-muted-200 rounded animate-pulse mb-2" />
          <div className="h-9 w-2/3 bg-muted-200 rounded animate-pulse" />
        </div>

        {/* Cover image skeleton */}
        <div className="mb-8 aspect-[16/9] bg-muted-200 rounded-sm animate-pulse" />

        {/* Body skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-muted-200 rounded animate-pulse"
              style={{ width: `${85 + (i % 3) * 5}%` }}
            />
          ))}
          <div className="h-4 w-1/2 bg-muted-200 rounded animate-pulse" />
          <div className="h-16" /> {/* paragraph gap */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i + 10}
              className="h-4 bg-muted-200 rounded animate-pulse"
              style={{ width: `${75 + (i % 4) * 6}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
